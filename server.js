'use strict'
const $setuprc = (require('setuprc')).base;
const $net = require('net');
const $serialrc = require('serialrc').base;
const $commandrc = new (require('commandrc')).base();


const _remoteCliRc = function(setup_in){
    this.run = async function(command){
        return await $commandrc.run(command);
    }
    this.add = function(texts,command,help){
        return $commandrc.add(texts,command,help);
    }
    this.log = async function(log){
        return await _log(log);
    }
    const _log = async function(log){
        if(
            (typeof log !== 'string') ||
            (2 > log.length)
        )
            return false;
        for(let i in _connections)
            if(typeof _connections[i].write !== 'undefined')
                await _connections[i].write(log);
            else
                delete _connections[i].write;
    }
    let _connections = {};
    const _setup = new $setuprc({
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
    
    if(typeof setup_in === 'undefined')
        for(let i in setup_in)
            _setup.set(i, setup_in[i]);

    const _server = $net.createServer(function(client){
        client.setEncoding('utf-8');
        client.setTimeout(_setup.get('timeout'));
        client.on('data', async function(data){
            _log(
                await $commandrc.run(data)
            );
        });
        _connections[$serialrc.get('remoteclirc')] = client;
   }).listen({
       port:_setup.get('port'),
       host:_setup.get('host')
   });
}

exports.base = _remoteCliRc;
