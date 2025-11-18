package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.ProgressEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressEntryRepository extends JpaRepository<ProgressEntry, Long> {
}
