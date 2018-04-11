package org.openkilda.floodlight.spike;

import org.projectfloodlight.openflow.types.DatapathId;

public class SwitchPortLink {
    private final DatapathId dpId;
    private final int srcPortNumber;
    private final int dstPortNumber;

    public SwitchPortLink(DatapathId dpId, int srcPortNumber, int dstPortNumber) {
        this.dpId = dpId;
        this.srcPortNumber = srcPortNumber;
        this.dstPortNumber = dstPortNumber;
    }

    public DatapathId getDpId() {
        return dpId;
    }

    public Integer getSrcPortNumber() {
        return srcPortNumber;
    }

    public int getDstPortNumber() {
        return dstPortNumber;
    }
}
