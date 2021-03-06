var app = {

	model: {
		"notas": [{"titulo": "comprar pan", "contenido": "Oferta de la panaderia de la esquina"}]
	},

	inicio: function(){
		this.iniciaFastClick();
		this.iniciaBotones();
		this.refrescarLista();
	},

	iniciaFastClick: function(){
		FastClick.attach(document.body);
	},

	iniciaBotones: function(){
		var salvar = document.querySelector('#salvar');
		var aniadir = document.querySelector('#aniadir');

		aniadir.addEventListener('click', this.mostrarEditor, false);
		salvar.addEventListener('click', this.salvarNota, false);
	},

	mostrarEditor: function(){
		document.getElementById('titulo').value = "";
		document.getElementById('comentario').value = "";
		document.getElementById('note-editor').style.display = "block";
		document.getElementById('titulo').focus();
	},

	salvarNota: function(){
		app.construirNota();
		app.ocultarEditor();
		app.refrescarLista();
		app.grabarDatos();
	},

	refrescarLista: function(){
		var div = document.getElementById('notes-list');
		div.innerHTML = this.aniadirNotasALista();
	},

	aniadirNotasALista: function(){
		var notas = this.model.notas;
		var notasDivs = '';

		for(var i in notas){
			var titulo = notas[i].titulo;
			notasDivs = notasDivs + this.aniadirNota(i, titulo);
		}
		return notasDivs;
	},

	aniadirNota: function(id, titulo){
		return "<div class='note-item' id='notas["+id+"]'>"+titulo+"</div>";
	},

	construirNota: function(){
		var notas = app.model.notas;
		notas.push({"titulo": app.extraerTitulo(), "contenido": app.extraerComentario()});
	},

	extraerTitulo: function(){
		return document.getElementById('titulo').value;
	},

	extraerComentario: function(){
		return document.getElementById('comentario').value;
	},

	ocultarEditor: function(){
		document.getElementById("note-editor").style.display = "none";
	},

	grabarDatos: function(){
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.gotFS, this.fail);
	},

	gotFS: function(fileSystem){
		fileSystem.getFile("files/"+"model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
	},

	gotFileEntry: function(fileEntry){
		fileEntry.createWriter(app.gotFileWriter, app.fail);
	},

	gotFileWriter: function(writer){
		writer.onwriteend = function(evt){
			console.log("Datos grabados en el directorio");
		};
		writer.write(JSON.stringify(app.model));
	},

	leerDatos: function(){
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.obtenerFS, this.fail);
	},

	obtenerFS: function(fileSystem){
		fileSystem.getFile("files/"+"model.json", null, app.obtenerFileEntry, app.noFile);
	},

	obtenerFileEntry: function(fileEntry){
		fileEntry.file(app.leerFile, app.fail);
	},

	leerFile: function(file){
		var reader = new FileReader();
		reader.onloadend = function(evt){
			var data = evt.target.result;
			app.model = JSON.parse(data);
			app.inicio();
		};
		reader.readAsText(file);
	},

};

if('addEventListener' in document){
	document.addEventListener("DOMContentLoaded", function(){
		app.inicio();
	}, false);
}





