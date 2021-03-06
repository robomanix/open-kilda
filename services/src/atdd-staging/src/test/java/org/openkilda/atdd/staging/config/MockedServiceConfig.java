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

package org.openkilda.atdd.staging.config;

import static org.mockito.Mockito.mock;

import net.jodah.failsafe.RetryPolicy;
import org.openkilda.atdd.staging.service.floodlight.FloodlightService;
import org.openkilda.atdd.staging.service.northbound.NorthboundService;
import org.openkilda.atdd.staging.service.topology.TopologyEngineService;
import org.openkilda.atdd.staging.service.traffexam.TraffExamService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.concurrent.TimeUnit;

@Configuration
@Profile("mock")
public class MockedServiceConfig {

    @Bean
    public FloodlightService floodlightService() {
        return mock(FloodlightService.class);
    }

    @Bean
    public NorthboundService northboundService() {
        return mock(NorthboundService.class);
    }

    @Bean
    public TopologyEngineService topologyEngineService() {
        return mock(TopologyEngineService.class);
    }

    // The retrier is used for repeating operations which depend on the system state and may change the result after delays.
    @Bean(name = "topologyEngineRetryPolicy")
    public RetryPolicy retryPolicy() {
        return new RetryPolicy()
                .withDelay(1, TimeUnit.MILLISECONDS)
                .withMaxRetries(3);
    }

    @Bean
    public TraffExamService traffExamService() {
        return mock(TraffExamService.class);
    }
}
