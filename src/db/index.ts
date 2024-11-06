import { userModel } from './schema/user.schema';
import { BookingModel } from './schema/booking.schema';
export {
    userModel,
    BookingModel
}

export const initializeSchemas=()=>{
    userModel.init();
    BookingModel.init();
}