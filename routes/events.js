/*
    Event Routes
    api/events
*/

const { Router } = require("express");
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validateJson' );
const { getEvents, newEvent, updateEvent, deleteEvent } = require( '../controllers/events' );
const { validateJWT } = require("../middlewares/validateJWT");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Todas deben pasar por validacion del JWT
router.use( validateJWT );

// Obtener eventos
router.get( '/', getEvents );

// Crear nuevo evento
router.post( 
    '/', 
    [
        check( 'title', 'El titulo es requerido' ).not().isEmpty(),
        check( 'start', 'La fecha de inicio es requerida' ).custom( isDate ),
        check( 'end', 'La fecha de finalización es requerida' ).custom( isDate ),
        validarCampos
    ],
    newEvent );

// Actualizar evento
router.put( '/:id', updateEvent );

// Eliminar evento
router.delete( '/:id', deleteEvent );


module.exports = router;