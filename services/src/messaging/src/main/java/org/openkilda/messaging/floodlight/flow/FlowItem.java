package org.openkilda.messaging.floodlight.flow;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;
import java.util.List;

@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FlowItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("version")
    private String version;

    @JsonProperty("cookie")
    private Long cookie;

    @JsonProperty("table_id")
    private String tableId;

    @JsonProperty("packet_count")
    private Long packetCount;

    @JsonProperty("byte_count")
    private Long byteCound;

    @JsonProperty("duration_sec")
    private Long durationSec;

    @JsonProperty("duration_nsec")
    private Long durationNSec;

    @JsonProperty("priority")
    private Integer priority;

    @JsonProperty("idle_timeout_s")
    private Long idleTimeout;

    @JsonProperty("hard_timeout_s")
    private Long hardTimeout;

    @JsonProperty("flags")
    private List<FlowFlag> flags;

    @JsonProperty("match")
    private FlowMatch match;

    @JsonProperty("hard_timeout_s")
    private FlowInstruction flowInstruction;

    public FlowItem() {
    }

    public String getVersion() {
        return version;
    }

    public Long getCookie() {
        return cookie;
    }

    public String getTableId() {
        return tableId;
    }

    public Long getPacketCount() {
        return packetCount;
    }

    public Long getByteCound() {
        return byteCound;
    }

    public Long getDurationSec() {
        return durationSec;
    }

    public Long getDurationNSec() {
        return durationNSec;
    }

    public Integer getPriority() {
        return priority;
    }

    public Long getIdleTimeout() {
        return idleTimeout;
    }

    public Long getHardTimeout() {
        return hardTimeout;
    }

    public List<FlowFlag> getFlags() {
        return flags;
    }

    public FlowMatch getMatch() {
        return match;
    }

    public FlowInstruction getFlowInstruction() {
        return flowInstruction;
    }
}
