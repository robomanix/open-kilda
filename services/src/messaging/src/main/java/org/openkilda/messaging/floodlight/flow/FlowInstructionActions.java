package org.openkilda.messaging.floodlight.flow;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;

@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlowInstructionActions implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("actions")
    private String actions;

    public FlowInstructionActions(String actions) {
        this.actions = actions;
    }

    public String getActions() {
        return actions;
    }
}
