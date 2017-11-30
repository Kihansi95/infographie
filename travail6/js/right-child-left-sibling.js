


// convention: _private and public
function right_child_left_sibling(definition) {

    // enum id for each elements
    this._definition = definition;




    this.initNodes = function(figure, id){throw "Not implemented"};

    /**
     * This function is called inside initNodes(Id). This create a new node from parameter.
     * @param {mat4} transform: transformation mattrix relative to its parent
     * @param {function} render: function for render view
     * @param {int} sibling: sibling's id
     * @param {int} child: child's id
     * @returns {{transform: *, render: *, sibling: *, child: *}}
     */
    this._createNode = function(transform, render, sibling, child) {
        var node = {
            transform: transform,
            render: render,
            sibling: sibling,
            child: child
        };
        return node;
    };

    // structure
    this._figure= [];
    for (var i = 0; i < Object.keys(this._definition).length; i++) this._figure[i] = this._createNode(null, null, null, null);

    this.build = function() {
        for (i = 0; i < Object.keys(this._definition).length; i++) this.initNodes(this._figure, i);
    };

    this.getFigure= function() {
        return this._figure;
    };
};

var RCLS = {
    traverse: function(structure, id) {
        if(id == null) return;
        stack.push(modelview);
        modelview = mult(modelview, structure[id].transform);
        structure[id].render();
        if(structure[id].child != null) this.traverse(structure, structure[id].child);
        modelview = stack.pop();
        if(structure[id].sibling != null) this.traverse(structure, structure[id].sibling);
    }
};