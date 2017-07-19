const influx = require('influx')
var kafka = require('kafka-node');

console.log('start');
// InfluxDB
var DB = new influx.InfluxDB({
    // single-host configuration
    host: 'nuc',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'dnslabInflux',
    password: 'dnslab',
    database: 'dnslabdatabases'
});

var resourceKafka = new kafka.Client('nuc:2181');
var resourceOffset = new kafka.Offset(resourceKafka);

console.log('fetch');
resourceOffset.fetch([{
        topic: 'sensor',
        partition: 0,
        time: -1,
        maxNum: 1
	},
	{
        topic: 'sensor',
        partition: 1,
        time: -1,
        maxNum: 1
    },
    {
        topic: 'sensor',
        partition: 2,
        time: -1,
        maxNum: 1
    }
], function(err, data) {
	console.log(data);
    var resourceConsumer = new kafka.Consumer(resourceKafka, [{
            topic: 'sensor',
            partition: 0,
            offset: data['sensor'][0]
        },
	{
            topic: 'sensor',
            partition: 1,
            offset: data['sensor'][0]
        },
	{
            topic: 'sensor',
            partition: 2,
            offset: data['sensor'][0]
        }
    ], {
        autoCommit: false,
        fromOffset: true
    });

    resourceConsumer.on('message', function(message) {
        var messageJSON = JSON.parse(message.value);

        DB.writePoints([{
            measurement: 'sensor',
            tags: {
            },
            fields: {
          	light: messageJSON.light,
		temp: messageJSON.temp
            },
        }])

    });

});
