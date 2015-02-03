module.exports = {

    profile: function () {
        
        var cpus = os.cpus().map(function (cpu) { 
            return { model: cpu.model, speed: cpu.speed };
        });
        
        return {
            name: os.hostName(),
            cpus: cpus,
            cores: cpus.length,
            type: os.type(),
            release: os.release(),
            architecture: os.arch(),
            platform: os.platform(),
            totalmem: os.totalmem()
        }
    },
    
    uptime: function () { return os.uptime(); },
    
    freeMemory: function () { return os.freemem(); },
    
    loadAverage: function () { return os.loadAvg(); }

};
