class InfoResult extends HTMLElement {
	constructor () {
		super();
		this.render = this.render.bind(this);
		this.render();
	}

	static get observedAttributes(){ return ['init-data']; }

	attributeChangedCallback(attribute, oldValue, newValue){
		if (attribute === 'init-data'){
			this.render(JSON.parse(newValue));
		}
	}

	render(data) {
		if (!data){
			return;
		}

		const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open'});
		shadowRoot.innerHTML = `
			<style>
				span {
					display: block;
					margin-bottom: 1em;
				}
			</style>
			<div>
				<span>Total a pagar ${data.totalToPay} </span>
				<span>Ya pagado ${data.alreadyPaid130} </span>
				<span>Por pagar ${data.pendingToPaid} </span>
				<span>Beneficio final ${data.profit} </span>
				<span>Porcentaje pagado ${data.taxRatePaid} </span>
			</div>
		`;
	}
}

class SendButton extends HTMLElement {
	constructor () {
		super();
		this.render = this.render.bind(this);
		this.fetch = this.fetch.bind(this);
		this.render();
	}

	connectedCallback() {
		this.addEventListener('click', this.fetch);
	}

	fetch() {
		const httpRequest = new XMLHttpRequest();
		const regionValue = document.querySelector('#region').shadowRoot.querySelector('select').value;
		const expensesValue = document.querySelector('#expenses').shadowRoot.querySelector('input').value;
		const revenueValue = document.querySelector('#revenue').shadowRoot.querySelector('input').value;
		httpRequest.onreadystatechange = () => {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					document.querySelector('#results').setAttribute('init-data', httpRequest.responseText);
				} else {
					console.log('There was a problem with the request.');
				}
			}
		};
		httpRequest.setRequestHeader('Content-Type', 'application/json');
		httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
		httpRequest.open('POST', 'https://kuantorenta.kiakora.com/calculate', true);
		httpRequest.send(`{"region":"${regionValue}", "expenses":${expensesValue},"revenue":${revenueValue}}`);

	}

	render() {
		const shadowRoot = this.attachShadow({ mode: 'open'});

		shadowRoot.innerHTML = `
			<style>
				.send_button {
					background-color: transparent;
					border: 1px solid white;
					color: white;
					cursor: pointer;
					font-family: 'Poiret One', cursive;
					margin: 5em 10%;
					padding: 1.5em;
					text-transform: uppercase;
					width: 80%;
				}
			</style>
			<button class="send_button">
				Calcular
			</button>
		`;
	}
}

class InputField extends HTMLElement {
	constructor () {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });

		shadowRoot.innerHTML = `
			<style>
			.form_field {
				display: block;
				margin-top: 1em;

			}
			</style>
			<section class="form_field">
				<label for="${this.id}">${this.label}</label>
				<input type="${this.type}" placeholder="${this.placeholder}" id=${this.id}" part="value"/>
				<span> € </span>
			</section>
		`;
	}
	get label () {
		return this.getAttribute('label');
	}
	get placeholder () {
		return this.getAttribute('placeholder');
	}
	get type () {
		return this.getAttribute('type');
	}
}

class SelectField extends HTMLElement {
	constructor () {
		super();

		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = `
			<label for="${this.id}">${this.label}</label>
			<select id="${this.id}" part="value">
			${this.options()}
			</select>
		`;
	}

	options () {
		const options = { 'andalucia': 'Andalucía' ,  'aragon': 'Aragón' , 'asturias': 'Asturias' , 'cantabria': 'Cantabria' , 'castillaLaMancha': 'Castilla la Mancha' , 'castillaLeon': 'Castilla León' , 'catalunya': 'Cataluña' , 'extremadura': 'Extremadura' , 'galicia': 'Galicia' , 'madrid': 'Madrid' , 'murcia': 'Murcia' , 'rioja': 'La Rioja' , 'valencia': 'Comunidad valenciana' , 'ceuta': 'Ceuta' , 'melilla': 'Melila' };
		return Object.keys(options).map(option => {	  
	return `<option value= "${option}">${options[option]}</option>`;
		});
	}

	get label () {
		return this.getAttribute('label');
	}
}

class FormContainer extends HTMLElement {
	constructor () {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = `
			<style>
			.form_container {
				font-family: 'Poiret One', cursive;
			}
			</style>
			<main id="${this.id}">    
				<slot></slot>            
			</main>
		`;
	}
}

customElements.define('form-container', FormContainer);
customElements.define('select-field', SelectField);
customElements.define('input-field', InputField);
customElements.define('send-button', SendButton);
customElements.define('info-result', InfoResult);

