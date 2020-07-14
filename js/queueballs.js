class Customer {
    constructor(color, queue) {
	this.color = color;
	this.queue = queue;
	this.id = Date.now();
	this.queue.push(this)
    };
}

class Queue {
    constructor(x,y,r, label ) {
        this.x = x;
        this.y = y;
	this.r = r;
	this.label = label;
	this.contents = [];
    };
    shift() {
        let cust = this.contents.pop();
	d3.select("svg#svg").selectAll(`circle.${this.label}`)
	    .data(this.contents, cust => cust.id)
	    .exit().remove();
    }
    push(el) {
        this.contents.push(el)
	let loc = this.location();
	console.log("label " + this.label + "length " + this.contents.length);
	console.log(loc);
	d3.select("svg#svg").selectAll(`circle.${this.label}`)
	    .data(this.contents).enter()
	    .append("circle").attr("r", d => {console.log(d);return this.r})
	    .attr("cx", d => { console.log("csx"); return loc.cx}).attr("cy", loc.cy)
	    .attr("class", this.label);
    }
    map(fun) {
	console.log('fun is ' + fun);
        return this.contents.map(x => fun(x));
    }
    foreach(fun) {
	this.contents.forEach(x => fun(x));
    }
    location(index = this.contents.length) {
	console.log("location called ");
	return {cx: this.x, cy: this.y + index * this.r * 10, r: this.r};
    }
}

class App {
    constructor(qs, r) {
        this.queues = [];
        for (let i=0;i<qs;i++) {
            this.queues.push(new Queue(80+10*i, 120, r,'q' + i));
	}
    }
    get(index) {
	return this.queues[index];
    }
}

function addTick() {
    if (Math.random() > qb.th) {
        let queueNr = Math.floor(Math.random() * 4);
        var c = new Customer(qb.colors[Math.floor(Math.random() * qb.colors.length)], qb.app.get(queueNr));
    } 
}

function removeTick() {
    if (Math.random() > qb.th) {
        qb.app.get(Math.floor(Math.random() * 4)).shift();
	
    }
    
}
