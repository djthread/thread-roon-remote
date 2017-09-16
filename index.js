var RoonApi          = require("node-roon-api"),
    RoonApiStatus    = require("node-roon-api-status"),
    RoonApiTransport = require("node-roon-api-transport");

var roon = new RoonApi({
    extension_id:        'com.threadbox.rune-remote',
    display_name:				 "Thread's Roon Remote",
    display_version:     "1.0.0",
    publisher:           'Thread',
    email:               'thethread@gmail.com',
    website:             'https://threadbox.net/',

    core_paired: function(core) {
        let transport = core.services.RoonApiTransport;
        transport.subscribe_zones(function(cmd, data) {
            console.log("PAIRED");
                                    console.log(core.core_id,
                                                core.display_name,
                                                core.display_version,
                                                "-",
                                                cmd,
                                                JSON.stringify(data, null, '  '));
                                });
    },

    core_unpaired: function(core) {
            console.log("UNPAIRED");
                console.log(core.core_id,
                        core.display_name,
                        core.display_version,
                        "-",
                        "LOST");
    }
});

var svc_status = new RoonApiStatus(roon);

roon.init_services({
    required_services: [ RoonApiTransport ],
    provided_services: [ svc_status ],
});

svc_status.set_status("All is good", false);

roon.start_discovery();
