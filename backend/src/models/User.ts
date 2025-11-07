import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
  calculatePopularityScore(): Promise<number>;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150
  },
  hobbies: {
    type: [String],
    required: true,
    default: []
  },
  friends: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  popularityScore: {
    type: Number,
    default: 0
  }
});

// Index for efficient querying
UserSchema.index({ id: 1 });
UserSchema.index({ username: 1 });

// Method to calculate popularity score
UserSchema.methods.calculatePopularityScore = async function() {
  const User = mongoose.model<IUser>('User');
  
  // Number of unique friends
  const friendCount = this.friends.length;
  
  // Calculate shared hobbies with friends
  let sharedHobbiesCount = 0;
  
  for (const friendId of this.friends) {
    const friend = await User.findOne({ id: friendId });
    if (friend) {
      const sharedHobbies = this.hobbies.filter((hobby: string) => 
        friend.hobbies.includes(hobby)
      );
      sharedHobbiesCount += sharedHobbies.length;
    }
  }
  
  // Formula: number of unique friends + (total hobbies shared with friends × 0.5)
  this.popularityScore = friendCount + (sharedHobbiesCount * 0.5);
  
  return this.popularityScore;
};

export default mongoose.model<IUser>('User', UserSchema);
