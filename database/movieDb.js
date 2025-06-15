import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);


const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 },
    ranking: Number,
    review: String,
    year: String,
    description: String,
    image_url: String
})

// Applying autoincrement on id
MovieSchema.plugin(AutoIncrement, { inc_field: 'movie_id' });

export default mongoose.model('Movies', MovieSchema);