package com.GLPT.Backend.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class GlobalContributionDto {

    private LocalDate date;
    private int count;

}
