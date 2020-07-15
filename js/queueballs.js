class Customer {
    constructor(color, queue) {
	this.color = color;
	this.queue = queue;
	this.id = Date.now();
	this.queue.push(this, {x: 250, y: 250})
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
    shift()  {
        let cust = this.contents.shift();
	let queue = d3.select("svg#svg").selectAll(`circle.${this.label}`)
	    .data(this.contents, cust => cust.id)
	queue.exit().remove();
	queue.transition().duration(1000).delay((d,i) => i * 200).attr("cy", (d,i) => {
	    console.log(`cy is  +(${this.y} + ${i}* ${this.r * 10}) = ${this.y + i*this.r * 10}`);
	    return this.y + i*this.r * 10});
					      
    }
    push(el, start) {
        this.contents.push(el)
	let loc = this.location();
	console.log("label " + this.label + "length " + this.contents.length);
	console.log(loc);
	d3.select("svg#svg").selectAll(`circle.${this.label}`)
	    .data(this.contents, d => d.id).enter()
	    .append("circle").attr("r", d => {console.log(d);return this.r})
	    .attr("cx", start.x).attr("cy", start.y)
	    .attr("class", this.label)
	    .transition().duration(800).delay(400)
	    .attr("cx", d => { console.log("csx"); return loc.cx}).attr("cy", loc.cy)
    }
    map(fun) {
	console.log('fun is ' + fun);
        return this.contents.map(x => fun(x));
    }
    foreach(fun) {
	this.contents.forEach(x => fun(x));
    }
    location(index = this.contents.length) {
	console.log(`location called " + (${this.y} + ${index}* ${this.r * 10} = ${this.y + index * this.r * 10} `);
	return {cx: this.x, cy: this.y + (index-1) * this.r * 10, r: this.r};
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
