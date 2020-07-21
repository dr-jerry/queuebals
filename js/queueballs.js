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
    constructor(x,y,r, label ) {
        this.x = x;
        this.y = y;
	this.r = r;
	this.label = label;
	this.contents = [];
    };

    randomElement() {
	return Math.floor(Math.random() * this.contents.length);
    }

    shift(index = this.randomElement(), nextQ)  {
	if (this.contents.length) {
            let cust = this.contents.splice(index,1)[0];
	    if (nextQ) {
		console.log("pushing to net " + cust.id);
		nextQ.push(cust, {x:this.x, y:this.y - 10});
	    }
	    let queue = d3.select("svg#svg").selectAll(`circle.${this.label}`)
		.data(this.contents, cust => cust.id);
	    queue.each(function(d,i) { if (i >= index) d.pos--; });
	    queue.exit().remove();
	    queue.transition().duration(1000).delay((d,i) => i * 200)
		.attr("cy", (d,i) => this.y + i*this.r)
		.attr("cx", (d,i) => this.x + (d.pos %2) *this.r)
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
        for (let i=0;i<qs;i++) {
            this.queues.push(new Queue(40+40*i, 120, r,'q' + i));
	}
    }
    get(index) {
	return this.queues[index];
    }
    addTick() {
	console.log("adde");
	if (Math.random() > qb.th) {
	    console.log("threshold");
            let queueNr = Math.floor(Math.random() * 4);
            var c = new Customer(qb.colors[Math.floor(Math.random() * qb.colors.length)], qb.app.get(queueNr), 2);
	} 
    }
    removeTick() {
	if (Math.random() > qb.th) {
            qb.app.get(Math.floor(Math.random() * 4)).shift(0);
	    
	}
	
    }
}
