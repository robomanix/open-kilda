/* Copyright 2018 Telstra Open Source
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
package org.openkilda.atdd.staging.steps;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;

import cucumber.api.Scenario;
import cucumber.api.java.Before;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java8.En;
import org.openkilda.atdd.staging.model.topology.TopologyDefinition;
import org.openkilda.atdd.staging.model.topology.TopologyDefinition.Isl;
import org.openkilda.atdd.staging.service.topology.TopologyEngineService;
import org.openkilda.atdd.staging.steps.helpers.TopologyChecker.IslMatcher;
import org.openkilda.atdd.staging.steps.helpers.TopologyChecker.SwitchMatcher;
import org.openkilda.messaging.info.event.IslInfoData;
import org.openkilda.messaging.info.event.SwitchInfoData;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TopologyVerificationSteps implements En {

    @Autowired
    private TopologyEngineService topologyEngineService;

    @Autowired
    private TopologyDefinition topologyDefinition;

    private List<TopologyDefinition.Switch> referenceSwitches;
    private List<TopologyDefinition.Isl> referenceLinks;
    private List<SwitchInfoData> actualSwitches;
    private List<IslInfoData> actualLinks;

    private Scenario scenario;

    @Before
    public void before(Scenario scenario) {
        this.scenario = scenario;
    }

    @Given("^the reference topology$")
    public void checkTheTopology() {
        Set<String> skippedSwitches = topologyDefinition.getSkippedSwitchIds();

        referenceSwitches = topologyDefinition.getActiveSwitches();
        actualSwitches = topologyEngineService.getActiveSwitches().stream()
                .filter(sw -> !skippedSwitches.contains(sw.getSwitchId()))
                .collect(toList());

        referenceLinks = topologyDefinition.getIslsForActiveSwitches();
        actualLinks = topologyEngineService.getActiveLinks().stream()
                .filter(sw -> !skippedSwitches.contains(sw.getPath().get(0).getSwitchId()))
                .filter(sw -> !skippedSwitches.contains(sw.getPath().get(1).getSwitchId()))
                .collect(Collectors.toList());
    }


    @And("^all defined switches are discovered")
    public void checkDiscoveredSwitches() {
        assertFalse("No switches were discovered", actualSwitches.isEmpty());

        assertThat("Discovered switches don't match expected", actualSwitches, containsInAnyOrder(
                referenceSwitches.stream().map(SwitchMatcher::new).collect(toList())));

    }

    @And("^all defined links are detected")
    public void checkDiscoveredLinks() {
        if (actualLinks.isEmpty() && referenceLinks.isEmpty()) {
            scenario.write("There are no links discovered as expected");
            return;
        }

        assertFalse("No links were discovered", actualLinks.isEmpty());

        assertThat("Discovered links don't match expected", actualLinks, containsInAnyOrder(
                referenceLinks.stream()
                        .flatMap(link -> {
                            //in kilda we have forward and reverse isl, that's why we have to divide into 2
                            Isl pairedLink = Isl.factory(link.getDstSwitch(), link.getDstPort(),
                                    link.getSrcSwitch(), link.getSrcPort(), link.getMaxBandwidth());
                            return Stream.of(link, pairedLink);
                        })
                        .map(IslMatcher::new)
                        .collect(toList())));
    }
}
