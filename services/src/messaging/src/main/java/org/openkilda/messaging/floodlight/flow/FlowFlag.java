package org.openkilda.messaging.floodlight.flow;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;

@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlowFlag implements Serializable {

    private static final long serialVersionUID = 1L;

}
