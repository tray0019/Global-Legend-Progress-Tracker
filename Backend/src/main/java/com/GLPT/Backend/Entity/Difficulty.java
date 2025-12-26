package com.GLPT.Backend.Entity;

import lombok.Data;


public enum Difficulty {
    EASY(1), MEDIUM(2),HARD(3);

    private final int value;

    Difficulty(int value){
        this.value = value;
    }

    public int getValue(){
        return value;
    }

    public static Difficulty fromValue(int value){
        for(Difficulty d: values()){
            if(d.getValue()== value) return d;
        }
        throw new IllegalCallerException("Invalid difficulty:"+value);
    }
}
