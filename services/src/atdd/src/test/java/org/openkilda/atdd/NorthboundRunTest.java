/* Copyright 2017 Telstra Open Source
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

package org.openkilda.atdd;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.openkilda.flow.FlowUtils.getHealthCheck;

import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.openkilda.SwitchesUtils;
import org.openkilda.flow.FlowUtils;
import org.openkilda.messaging.command.switches.DeleteRulesAction;
import org.openkilda.messaging.info.event.PathInfoData;
import org.openkilda.messaging.info.event.PathNode;
import org.openkilda.messaging.payload.flow.FlowCacheSyncResults;
import org.openkilda.messaging.payload.flow.FlowIdStatusPayload;
import org.openkilda.messaging.payload.flow.FlowPathPayload;
import org.openkilda.messaging.payload.flow.FlowPayload;
import org.openkilda.messaging.payload.flow.FlowState;

import java.util.Arrays;
import java.util.List;

public class NorthboundRunTest {
    private static final FlowState expectedFlowStatus = FlowState.UP;
    private static final PathInfoData expectedFlowPath = new PathInfoData(0L, Arrays.asList(
            new PathNode("de:ad:be:ef:00:00:00:03", 2, 0),
            new PathNode("de:ad:be:ef:00:00:00:04", 1, 1),
            new PathNode("de:ad:be:ef:00:00:00:04", 2, 2),
            new PathNode("de:ad:be:ef:00:00:00:05", 1, 3)));

    @Then("^path of flow (.*) could be read$")
    public void checkFlowPath(final String flowId) {
        String flowName = FlowUtils.getFlowName(flowId);

        FlowPathPayload payload = FlowUtils.getFlowPath(flowName);
        assertNotNull(payload);

        assertEquals(flowName, payload.getId());
        assertEquals(expectedFlowPath, payload.getPath());
    }

    @Then("^status of flow (.*) could be read$")
    public void checkFlowStatus(final String flowId) throws Exception {
        String flowName = FlowUtils.getFlowName(flowId);
        FlowIdStatusPayload payload = FlowUtils.waitFlowStatus(flowName, expectedFlowStatus);

        assertNotNull(payload);

        assertEquals(flowName, payload.getId());
        assertEquals(expectedFlowStatus, payload.getStatus());
    }

    @Then("^flows dump contains (\\d+) flows$")
    public void checkDumpFlows(final int flowCount) {
        List<FlowPayload> flows = FlowUtils.getFlowDump();
        assertNotNull(flows);
        flows.forEach(flow -> System.out.println(flow.getId()));
        assertEquals(flowCount, flows.size());
    }

    @Given("^health check$")
    public void healthCheck() throws Throwable {
        assertEquals(200, getHealthCheck());
    }

    @Then("^flow (\\w+) in (\\w+) state$")
    public void flowState(String flowId, String state) throws Throwable {
        String flowName = FlowUtils.getFlowName(flowId);
        FlowState flowState = FlowState.valueOf(state);
        FlowIdStatusPayload payload = FlowUtils.waitFlowStatus(flowName, flowState);
        assertNotNull(payload);
        assertEquals(flowName, payload.getId());
        assertEquals(flowState, payload.getStatus());
    }

    @Then("^delete all non-default rules on (.*) switch$")
    public void deleteAllNonDefaultRules(String switchId) {
        List<Long> cookies = SwitchesUtils.deleteSwitchRules(switchId, DeleteRulesAction.IGNORE);
        assertNotNull(cookies);
        cookies.forEach(cookie -> System.out.println(cookie));
    }

    @Then("^delete all rules on (.*) switch$")
    public void deleteAllDefaultRules(String switchId) {
        List<Long> cookies = SwitchesUtils.deleteSwitchRules(switchId, DeleteRulesAction.DROP);
        assertNotNull(cookies);
        cookies.forEach(cookie -> System.out.println(cookie));
    }

    @Then("^synchronize flow cache is successful with (\\d+) dropped flows$")
    public void synchronizeFlowCache(final int droppedFlowsCount) {
        FlowCacheSyncResults results = FlowUtils.synchFlowCache();
        assertNotNull(results);
        assertEquals(droppedFlowsCount, results.getDroppedFlows().length);
    }

    @Then("^invalidate flow cache is successful with (\\d+) dropped flows$")
    public void invalidateFlowCache(final int droppedFlowsCount) {
        FlowCacheSyncResults results = FlowUtils.invalidateFlowCache();
        assertNotNull(results);
        assertEquals(droppedFlowsCount, results.getDroppedFlows().length);
    }

    @When("^flow (.*) could be deleted from DB$")
    public void deleteFlowFromDbViaTE(final String flowName) {
        String flowId = FlowUtils.getFlowName(flowName);
        boolean deleted = FlowUtils.deleteFlowViaTE(flowId);

        assertTrue(deleted);
    }
}
