package com.iat.lms.service;

import com.iat.lms.dto.BatchDto;
import com.iat.lms.entity.*;
import com.iat.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final BatchStudentRepository batchStudentRepository;

    @Transactional
    public BatchDto.Response createBatch(BatchDto.CreateRequest request, String creatorEmail) {
        if (batchRepository.existsByBatchName(request.getBatchName())) {
            throw new RuntimeException("Batch name already exists: " + request.getBatchName());
        }
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found: " + request.getCourseId()));
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User trainer = null;
        if (request.getTrainerId() != null) {
            trainer = userRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found: " + request.getTrainerId()));
        }

        Batch batch = Batch.builder()
                .batchName(request.getBatchName())
                .course(course)
                .trainer(trainer)
                .batchType(request.getBatchType())
                .timing(request.getTiming())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isActive(true)
                .createdBy(creator)
                .build();

        return toResponse(batchRepository.save(batch));
    }

    @Transactional
    public void assignStudentToBatch(Long batchId, Long studentId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
        Student student = new Student();
        student.setId(studentId);

        if (batchStudentRepository.existsByBatchIdAndStudentId(batchId, studentId)) {
            throw new RuntimeException("Student already enrolled in this batch");
        }
        BatchStudent bs = BatchStudent.builder().batch(batch).student(student).build();
        batchStudentRepository.save(bs);
    }

    @Transactional
    public void unassignStudentFromBatch(Long batchId, Long studentId) {
        BatchStudent bs = batchStudentRepository.findByBatchIdAndStudentId(batchId, studentId)
                .orElseThrow(() -> new RuntimeException("Student is not enrolled in this batch"));
        batchStudentRepository.delete(bs);
    }

    public List<BatchDto.Response> getAllBatches() {
        return batchRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BatchDto.Response> getActiveBatches() {
        return batchRepository.findActiveBatches().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BatchDto.Response getBatchById(Long id) {
        return toResponse(batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + id)));
    }

    public List<BatchDto.Response> getTrainerBatches(Long trainerId) {
        return batchRepository.findByTrainerId(trainerId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BatchDto.Response> getStudentBatches(Long studentId) {
        return batchRepository.findBatchesByStudentId(studentId).stream().map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BatchDto.Response toResponse(Batch b) {
        int studentCount = (b.getId() != null)
                ? batchStudentRepository.findByBatchId(b.getId()).size()
                : 0;

        return BatchDto.Response.builder()
                .id(b.getId())
                .batchName(b.getBatchName())
                .courseName(b.getCourse() != null ? b.getCourse().getName() : null)
                .trainerName(b.getTrainer() != null ? b.getTrainer().getName() : "Not Assigned")
                .batchType(b.getBatchType() != null ? b.getBatchType().name() : null)
                .timing(b.getTiming())
                .startDate(b.getStartDate())
                .endDate(b.getEndDate())
                .isActive(b.getIsActive() != null ? b.getIsActive() : true)
                .studentCount(studentCount)
                .build();
    }
}
