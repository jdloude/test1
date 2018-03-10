const mediator = {
    observers: [],
    emit: function(emitted) {
        this.observers.forEach(element => {
            element(emitted);
        });
    }
};

module.exports = mediator;