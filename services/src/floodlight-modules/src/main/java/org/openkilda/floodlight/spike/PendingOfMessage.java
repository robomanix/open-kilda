package org.openkilda.floodlight.spike;

import net.floodlightcontroller.core.IOFSwitch;
import org.projectfloodlight.openflow.protocol.OFMessage;
import org.projectfloodlight.openflow.protocol.OFType;
import org.projectfloodlight.openflow.types.DatapathId;

public class PendingOfMessage {
    private final int MAX_WRITE_ERROR = 5;

    private final DatapathId dpId;
    private final OFMessage payload;
    private final long xid;
    private boolean isInstalled = false;
    private int writeErrors = 0;

    public PendingOfMessage(DatapathId dpId, OFMessage payload) {
        this.dpId = dpId;
        this.payload = payload;
        this.xid = payload.getXid();
    }

    public void install(SwitchUtils switchUtils) throws SwitchWriteError {
        if (isInstalled) {
            return;
        }

        IOFSwitch sw = switchUtils.lookupSwitch(getDpId());
        isInstalled = sw.write(payload);

        if (!isInstalled) {
            writeErrors += 1;
            if (MAX_WRITE_ERROR <= writeErrors) {
                throw new SwitchWriteError(getDpId(), getPayload());
            } else {
                throw new SwitchWriteRepeatableError(getDpId(), getPayload());
            }
        }
    }

    public void response(OFMessage payload) throws OFModError {
        if (OFType.ERROR.equals(payload.getType())) {
            throw new OFModError(getDpId(), payload);
        }
    }

    public DatapathId getDpId() {
        return dpId;
    }

    public OFMessage getPayload() {
        return payload;
    }

    public long getXid() {
        return xid;
    }

    public int getWriteErrors() {
        return writeErrors;
    }
}
