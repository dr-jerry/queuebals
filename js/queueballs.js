class Customer {
    constructor(color, queue, r) {
	this.color = color;
	this.queue = queue;
	this.id = Date.now();
	this.pos = 0;
	this.r = r;
	this.queue.push(this, {x: 250, y: 250})
    };
}

class Queue {
    constructor(x,y,r, label, servant) {
	console.log("constructing constructing " + label);
        this.x = x;
        this.y = y;
	this.r = r;
	this.label = label;
	this.contents = [];
	this.shiftCount = 0;this.modu = 4;
	console.log("modu is "+ this.modu);
	this.waiting = false;
	if (servant) {
	    d3.select("svg#svg").selectAll(`circle.server_${this.label}`)
		.data([servant], d => d.id).enter()
		.append("circle").attr("r", d => d.r)
		.attr("cx", x).attr("cy", y-40)
		.attr("class", "server_" + this.label)
		.attr("stroke", "#3333FF")
		.attr("fill", "#3333FF")
	}

    };

    randomElement() {
	return Math.floor(Math.random() * this.contents.length);
    }
    moveWaitor(status) {
    }

    shift(index = this.randomElement(), nextQ)  {
//	console.log("shiftcount " + this.shiftCount);
//	moveWaiter(this.waiting)
//	console.log(nextQ);
	if (this.contents.length && this.shiftCount++ % this.modu == this.modu-1) {
	    d3.select("svg#svg").selectAll(`circle.server_${this.label}`)
		.transition().duration(200).delay(0)
	        .attr("cy", d => this.y - 40 + 15);
            let cust = this.contents.splice(index,1)[0];
	    if (nextQ) {
//		console.log("pushing to net " + cust.id);
		nextQ.push(cust, {x:this.x, y:this.y - 10});
	    }
	    let queue = d3.select("svg#svg").selectAll(`circle.${this.label}`)
		.data(this.contents, cust => cust.id);
	    queue.each(function(d,i) { if (i >= index) d.pos--; });
	    queue.exit().transition().duration(300).delay(300).attr("cx", 410).remove();
	    queue.transition().duration(1000).delay((d,i) => i * 200)
		.attr("cy", (d,i) => this.y + i*this.r)
		.attr("cx", (d,i) => this.x + (d.pos %2) *this.r)
	} else if (this.shiftCount % this.modu == Math.floor(this.modu/2)) {
	    d3.select("svg#svg").selectAll(`circle.server_${this.label}`)
		.transition().duration(200).delay(0)
	        .attr("cy", d => this.y - 40 - 15);
	}
    }
    push(el, start) {
	el.pos = this.contents.length;
        this.contents.push(el);
	d3.select("svg#svg").selectAll(`circle.${this.label}`)
	    .data(this.contents, d => d.id).enter()
	    .append("circle").attr("r", d => d.r)
	    .attr("cx", start.x).attr("cy", start.y)
	    .attr("class", this.label)
	    .transition().duration(800).delay(400)
	    .attr("cx", d => this.x + (d.pos % 2) *this.r)
	    .attr("cy", d => this.y + d.pos * this.r)
    }

}

class App {
    constructor(qs, r) {
        this.queues = [];
	//this.waitQ = new Queue(250, 110, 4, 'wait');
        for (let i=0;i<qs;i++) {
            this.queues.push(new Queue(40+40*i, 120, r,'q' + i, {id: Date.now(), r: 3}));
	}
    }
    get(index) {
	return this.queues[index];
    }
    addTick() {
	if (Math.random() > qb.th) {
            let queueNr = Math.floor(Math.random() * 4);
            var c = new Customer(qb.colors[Math.floor(Math.random() * qb.colors.length)], qb.app.get(queueNr), 2);
	} 
    }
    removeTick(queue) {
	if (queue) {
	    if (Math.random() > qb.th/2) queue.shift()
	} else {
	    if (Math.random() > qb.th) {
		this.get(Math.floor(Math.random() * 4)).shift(0, qb.waitQ);
	    
	    }
	}
	
    }
}
