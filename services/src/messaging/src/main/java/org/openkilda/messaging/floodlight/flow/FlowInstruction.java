package org.openkilda.messaging.floodlight.flow;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;

@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlowInstruction implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("instruction_apply_actions")
    private FlowInstructionActions instructionActions;

    @JsonProperty("none")
    private String none;

    public FlowInstruction() {
    }

    public FlowInstructionActions getInstructionActions() {
        return instructionActions;
    }

    public String getNone() {
        return none;
    }
}
