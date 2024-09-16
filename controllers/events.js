const { response } = require( 'express' );
const Evento = require( '../models/Evento' );
const Usuario = require( '../models/User' );

const getEvents = async( req, res = response ) => {

    const eventos = await Evento.find().populate( 'user', 'name' );

    return res.status(200).json({
        ok: true,
        eventos
    });
}

const newEvent = async( req, res = response ) => {
    // Verificar que tenga el evento
    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;
        const savedEvent = await evento.save();
        return res.status(201).json({
            ok: true,
            evento: savedEvent,
            msg: 'Evento gaurdado exitosamente'
        });
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }

}

const updateEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }
}

const deleteEvent = async( req, res = response ) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById( eventId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese ID'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no autorizado'
            });
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventId );

        res.json({
            ok: true,
            msg: eventoEliminado
        })

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })
    }
}


module.exports = {
    getEvents,
    newEvent,
    updateEvent,
    deleteEvent
}