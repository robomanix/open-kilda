package org.openkilda.messaging.floodlight.flow;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;

@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlowMatch implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("eth_dst")
    private String ethDst;

    public FlowMatch() {
    }

    public String getEthDst() {
        return ethDst;
    }
}
