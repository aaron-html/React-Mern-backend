const { response } = require( 'express' );
const bcrypt = require( 'bcryptjs' );
const User = require( '../models/User' );
const { generarJWT } = require( '../helpers/jwt' );

const createUser = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese email'
            })
        }

        user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar nuestro JWT
        const token = await generarJWT( user.uid, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });
    }
}

const loginUser = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario con ese email'
            })
        }        
        // Confirmar las contraseñas
        const validatePassword = bcrypt.compareSync( password, user.password );

        if ( !validatePassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( user._id.toString(), user.name );

        res.json({
            ok: true,
            uid: user.uid,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });
    }
};

const revalidateToken = async( req, res = response ) => {
    const { uid, name } = req;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        token
    })
};


module.exports = {
    createUser,
    loginUser,
    revalidateToken
}