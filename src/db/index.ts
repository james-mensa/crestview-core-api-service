import { userModel } from './schema/user.schema';
import { BookingModel } from './schema/booking.schema';
import { SuiteTypeModel } from './schema/suiteType.schema';
export {
    userModel,
    BookingModel,
    SuiteTypeModel
}

export const initializeSchemas=()=>{
    userModel.init();
    BookingModel.init();
    SuiteTypeModel.init();
}