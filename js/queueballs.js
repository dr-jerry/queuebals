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
            let cust = this.contents.splice(index,1);
	    if (nextQ) {
		console.log("pushing " + cust.id);
		nextQ.push(cust, {x:this.x, y:this.y - 10});
	    }
	    let queue = d3.select("svg#svg").selectAll(`circle.${this.label}`)
		.data(this.contents, cust => cust.id);
	    queue.each(function(d,i) { console.log(`${i} ${index} ${d.pos}`);
				       if (i >= index) d.pos--;
				     console.log(`${i} ${index} ${d.pos}`);});
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
	    .append("circle").attr("r", d => { console.log("radius" +  d.r); return d.r})
	    .attr("cx", start.x).attr("cy", start.y)
	    .attr("class", this.label)
	    .transition().duration(800).delay(400)
	    .attr("cx", d => {
		console.log("thais.x " + this.x + "d.pos" + d);return this.x + (d.pos % 2) *this.r})
	    .attr("cy", d => { console.log("this.y is " + this.y);
			       return this.y + d.pos * this.r})
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
	return {cx: this.x + ((this.l ? 0 : 1) + this.contents.length) % 2 * this.r, cy: this.y + (index-1) * this.r};
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
}

function addTick() {
    if (Math.random() > qb.th) {
        let queueNr = Math.floor(Math.random() * 4);
        var c = new Customer(qb.colors[Math.floor(Math.random() * qb.colors.length)], qb.app.get(queueNr));
    } 
}

function removeTick() {
    if (Math.random() > qb.th) {
        qb.app.get(Math.floor(Math.random() * 4)).shift(0);
	
    }
    
}
