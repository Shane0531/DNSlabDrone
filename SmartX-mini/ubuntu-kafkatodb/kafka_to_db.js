const influx = require('influx')
var kafka = require('kafka-node');

var topic_name = process.env.TOPIC_NAME
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
        topic: topic_name,
        partition: 0,
        time: -1,
        maxNum: 1
    }
], function(err, data) {
    console.log(data);
    var resourceConsumer = new kafka.Consumer(resourceKafka, [{
            topic: topic_name,
            partition: 0,
            offset: data[topic_name][0]
        }
    ], {
        autoCommit: false,
        fromOffset: true
    });

    resourceConsumer.on('message', function(message) {
	var messageJSON = JSON.parse(message.value);
        DB.writePoints([{
            measurement: topic_name,
            tags: {
            },
            fields: {
		id : messageJSON.ID,
          	light: messageJSON.light,
		temp: messageJSON.temp,
		latitude: messageJSON.latitude,
		logitude: messageJSON.logitude,
		ratio: messageJSON.ratio,
		concentration: messageJSON.concentration,
		lowpulseoccupancy: messageJSON.lowpulseoccupancy,
		humidity: messageJSON.humidity,
		luminance: messageJSON.luminance
            },
        }])
        console.log(messageJSON);

    });

});

