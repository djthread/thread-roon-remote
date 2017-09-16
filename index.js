var RoonApi = require("node-roon-api");

var roon = new RoonApi({
    extension_id:        'com.threadbox.rune-remote',
    display_name:				 "Thread's Roon Remote",
    display_version:     "1.0.0",
    publisher:           'Thread',
    email:               'thethread@gmail.com',
    website:             'https://threadbox.net/'
});

roon.init_services({});

roon.start_discovery();
