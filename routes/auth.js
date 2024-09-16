/*
    Rutas de usuarios / auth
    host + /api/auth
*/

const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { createUser, loginUser, revalidateToken } = require( '../controllers/auth' );
const { validarCampos } = require( '../middlewares/validateJson' );
const { validateJWT } = require( '../middlewares/validateJWT' );

const router = Router();

router.post( 
    '/', 
    [
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'password', 'El password debe de ser de 6 caracteres' ).isLength({ min: 6 }),
        validarCampos
    ], 
    loginUser 
);

router.post( 
    '/new', 
    [
        check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'password', 'El password debe de ser de 6 caracteres' ).isLength({ min: 6 }),
        validarCampos
    ], 
    createUser 
);

router.get( '/renew', validateJWT, revalidateToken );


module.exports = router;