'use strict'
const $setuprc = (require('setuprc')).base;
const $net = require('net');
const $serialrc = require('serialrc').base;
const $commandrc = new (require('commandrc')).base();


const _remoteCliRc = function(){
    this.run = function(command){
        return $commandrc.run(command);
    }
    this.add = function(texts,command,help){
        return $commandrc.add(texts,command,help);
    }
    this.log = function(log){
        for(let i in _connections)
            _connections[i].write(log);
    }
    let _connections = {};
    const _setup = new $setup({
        'timeout' : {
            'type'    : 'integer',
            'min'     : 1000,
            'max'     : 99999999,
            'default' : 60000
        },
        'port' : {
            'type'    : 'integer',
            'min'     : 1,
            'max'     : 65000,
            'default' : 5865
        },
        'host' : {
            'type'    : 'string',
            'default' : 'localhost'
        }
    });

    const _server = $net.createServer(function(client){
        client.setEncoding('utf-8');
        client.setTimeout(_setup.get('timeout'));
        _connection[_serialrc.get('remoteclirc')] = client;
   }).listen({
       port:_setup.get('port'),
       host:_setup.get('host')
   });
}

exports.base = remoteCliRc;
