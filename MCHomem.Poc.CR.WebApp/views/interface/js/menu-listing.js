﻿MenuListing = {

    self: this

    , init: function () {
        self.$loading = document.querySelector('.loading');
        self.$btnNew = document.getElementById('btnNew');
        self.$grid = document.getElementById('grid');

        this.attachEvent();
        this.loadData();
    }

    , attachEvent: function () {
        self.$btnNew.addEventListener('click', function () {
            sessionStorage.setItem('MenuID', 0);
            Utils.loadPage('menu-maintenance.html');
        });
    }

    , loadData: function () {
        var xhttp;

        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            xhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhttp.onreadystatechange = function () {
            if (this.status === 500) {
                if (this.responseText != '') {
                    var response = JSON.parse(this.responseText);
                    MenuListing.changeLoadingIcon();
                    Dialog.show
                        (
                            'Ops!'
                            , 'Ocorreu um problema. Mensagem do sistema: ' + this.statusText + ' (' + this.status + ') - ' + response.InnerException.ExceptionMessage
                            , Dialog.MessageType.ERROR
                            , Dialog.DisplayType.MODAL
                        );
                }
            }

            if (this.readyState === 4 && this.status === 200) {
                MenuListing.setDataGrid(JSON.parse(this.responseText));
            }
        };

        try {
            xhttp.open('get', Server.setService('api/menus'), true);
            xhttp.send();
        } catch (e) {
            Dialog.show
                (
                    'Ops!'
                    , 'Ocorreu um problema.  Mensagem do sistema: ' + e.message + '. Stacktrace: ' + e.stacktrace
                    , Dialog.MessageType.ERROR
                    , Dialog.DisplayType.MODAL
                );
        }
    }

    , setDataGrid: function (dataSource) {
        var grid = document.getElementById('grid');
        self.$loading.classList.add('w3-hide');

        if (dataSource.length == 0) {
            var nodata = document.querySelector('#nodata');
            nodata.classList.remove('w3-hide');
            return;
        }

        for (var i = 0; i < dataSource.length; i++) {
            var row = grid.insertRow(i + 1);
            var col1 = row.insertCell(0);
            var col2 = row.insertCell(1);
            var col3 = row.insertCell(2);
            var col4 = row.insertCell(3);
            var col5 = row.insertCell(4);
            var col6 = row.insertCell(5);
            var col7 = row.insertCell(6);
            var col8 = row.insertCell(7);

            var menu = dataSource[i];

            col1.innerHTML = menu.Label;
            col2.innerHTML = menu.Page;
            col3.innerHTML = menu.ParentMenu != null ? menu.ParentMenu.Label : '-';
            col4.innerHTML = menu.Active ? 'Sim' : 'Não';
            col5.innerHTML = menu.Visible ? 'Sim' : 'Não';
            col6.innerHTML = menu.Order;
            col7.appendChild(this.rowCommand('update', menu.MenuID));
            col8.appendChild(this.rowCommand('delete', menu.MenuID));
        }
    }

    , rowCommand: function (command, argument) {
        var control;
        control = document.createElement('button');
        control.setAttribute('data-entity-id', argument);
        control.setAttribute('type', 'button');
        control.setAttribute('class', 'w3-btn');

        var faIcon = document.createElement('i');
        control.appendChild(faIcon);

        switch (command) {
            case 'update':
                control.setAttribute('id', 'btnUpdate_' + argument);
                faIcon.setAttribute('class', 'fas fa-pen');
                control.addEventListener('click', function () {
                    MenuListing.update(argument);
                });
                break;

            case 'delete':
                control.setAttribute('id', 'btnDelete_' + argument);
                faIcon.setAttribute('class', 'fas fa-trash-alt');
                faIcon.setAttribute('style', 'color:red');
                control.addEventListener('click', function () {
                    MenuListing.delete(argument);
                });
                break;

            default:
                control = '';
                break;
        }

        return control;
    }

    , update: function (data) {
        sessionStorage.setItem('MenuID', data);
        Utils.loadPage('menu-maintenance.html');
    }

    , delete: function (data) {
        var op = confirm('Deseja excluir o menu?');

        if (op) {
            var xhttp;

            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest();
            } else {
                xhttp = new ActiveXObject('Microsoft.XMLHTTP');
            }

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    Menu.init();
                    MenuListing.cancel();
                }
            };

            xhttp.open('delete', Server.setService('api/menus/' + data), true);
            xhttp.send();
        }
    }

    , cancel: function () {
        Utils.loadPage('menu-listing.html');
    }

    , changeLoadingIcon: function () {
        document.querySelector('.fa, .fa-spinner, .fa-4x, .w3-spin').classList.remove('w3-spin');
        document.querySelector('.fa, .fa-spinner, .fa-4x, .w3-spin').classList.replace('fa-spinner', 'fa-exclamation-triangle');
    }
};