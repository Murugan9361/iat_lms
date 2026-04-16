package com.iat.lms.service;

import com.iat.lms.dto.SyllabusDto;
import com.iat.lms.entity.*;
import com.iat.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;

    /**
     * DYNAMIC SCHEDULING LOGIC:
     * - WEEKDAY batch: Mon–Fri only (skip Sat & Sun), 1.5h/day
     * - WEEKEND batch: Sat & Sun only, 3h/day
     * Generates syllabus slots from startDate to endDate.
     */
    public List<SyllabusDto.Response> generateSyllabusSlots(Long batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));

        List<LocalDate> validDates = new ArrayList<>();
        LocalDate current = batch.getStartDate();

        while (!current.isAfter(batch.getEndDate())) {
            DayOfWeek dow = current.getDayOfWeek();
            if (batch.getBatchType() == Batch.BatchType.WEEKDAY) {
                // Mon–Fri only
                if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                    validDates.add(current);
                }
            } else {
                // Weekend: Sat & Sun only
                if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                    validDates.add(current);
                }
            }
            current = current.plusDays(1);
        }

        // Save slots if not already existing
        int dayNum = 1;
        List<Syllabus> created = new ArrayList<>();
        for (LocalDate date : validDates) {
            if (!syllabusRepository.existsByBatchIdAndDate(batchId, date)) {
                Syllabus s = Syllabus.builder()
                        .batch(batch)
                        .date(date)
                        .topic("Day " + dayNum + " - Topic TBD")
                        .status(Syllabus.Status.PENDING)
                        .dayNumber(dayNum)
                        .build();
                created.add(syllabusRepository.save(s));
            }
            dayNum++;
        }

        return created.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public SyllabusDto.Response updateTopic(Long syllabusId, SyllabusDto.CreateTopicRequest request,
            String updaterEmail) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus entry not found: " + syllabusId));
        User updater = userRepository.findByEmail(updaterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        syllabus.setTopic(request.getTopic());
        if (request.getDescription() != null)
            syllabus.setDescription(request.getDescription());
        syllabus.setUpdatedBy(updater);
        return toResponse(syllabusRepository.save(syllabus));
    }

    @Transactional
    public SyllabusDto.Response updateStatus(Long syllabusId, SyllabusDto.UpdateStatusRequest request,
            String updaterEmail) {
        Syllabus syllabus = syllabusRepository.findById(syllabusId)
                .orElseThrow(() -> new RuntimeException("Syllabus entry not found: " + syllabusId));
        User updater = userRepository.findByEmail(updaterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        syllabus.setStatus(request.getStatus());
        syllabus.setUpdatedBy(updater);
        return toResponse(syllabusRepository.save(syllabus));
    }

    public List<SyllabusDto.Response> getByBatch(Long batchId) {
        return syllabusRepository.findByBatchIdOrderByDateAsc(batchId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public SyllabusDto.Response toResponse(Syllabus s) {
        return SyllabusDto.Response.builder()
                .id(s.getId())
                .batchId(s.getBatch().getId())
                .batchName(s.getBatch().getBatchName())
                .date(s.getDate())
                .topic(s.getTopic())
                .description(s.getDescription())
                .status(s.getStatus() != null ? s.getStatus().name() : null)
                .dayNumber(s.getDayNumber())
                .updatedBy(s.getUpdatedBy() != null ? s.getUpdatedBy().getName() : null)
                .build();
    }
}
