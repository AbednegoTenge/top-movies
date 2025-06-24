import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';


const AutoIncrement = mongooseSequence(mongoose);

const MovieSchema = new mongoose.Schema({
    id: { type: Number},
    title: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 },
    ranking: Number,
    review: String,
    year: String,
    description: String,
    image_url: String
})

MovieSchema.plugin(AutoIncrement, {
    inc_field: 'id'
});

export default mongoose.model('Movies', MovieSchema);