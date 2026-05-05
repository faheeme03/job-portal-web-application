package com.jobportal.backend.repository;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findByEmployer(User employer, Pageable pageable);
    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minSalary IS NULL OR j.salary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.salary <= :maxSalary) AND " +
           "(:experienceLevel IS NULL OR :experienceLevel = '' OR j.experienceLevel = :experienceLevel) AND " +
           "(:jobType IS NULL OR :jobType = '' OR j.jobType = :jobType) AND " +
           "(:skill IS NULL OR :skill = '' OR LOWER(j.skills) LIKE LOWER(CONCAT('%', :skill, '%')))")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("location") String location, 
                         @Param("minSalary") BigDecimal minSalary, 
                         @Param("maxSalary") BigDecimal maxSalary, 
                         @Param("experienceLevel") String experienceLevel, 
                         @Param("jobType") String jobType, 
                         @Param("skill") String skill,
                         Pageable pageable);
}
