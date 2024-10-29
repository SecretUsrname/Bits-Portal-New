
import mongoose from 'mongoose';

const PaperSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required: true, 

        },
        authors:{
            type:[String],
            required:true,
        },
        DOI:{
            type:String,
            required:true,
        },
        publisher:{
            type:String,
            required:true,
        }, 
        year:{
            type:Number,
            required:true,
        }
    },

    {
        timeStamp: true
    }
);

const Paper = mongoose.model("Paper", PaperSchema);

export default Paper;
