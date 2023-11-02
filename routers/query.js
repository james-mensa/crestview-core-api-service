const { model, set } = require("mongoose");
const { format } = require("date-fns");
const {
  RoomModel,
  BookingModel,
  RatemeModel,
  TestimonialModel,
  RoomTypeModel,
  ConferenceModel,
  RooftopModel,
} = require("../models/Database");

const {
  sortArticles,
  generateRandomString,
  isTimeBetween,
} = require("../middleware/utils");
const express = require("express");
const { User } = require("../models/users");
const { Contactmail } = require("../config/gateway");
const routes = express.Router();
/** creation */

routes.route("/admin/room/addroom").post(async (req, res) => {
  try {
    const data = new RoomModel({
      ...req.body,
    });
    const content = await data.save();
    console.log(content);
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/admin/room/addfromcategory").post(async (req, res) => {
  try {
    const item = req.body;
    const checkroom = await RoomModel.find({ room_numer: item.room_numer });
    if (checkroom.length > 0) {
      res.status(400).json({ msg: "Room already exits" });
    } else {
      const data = new RoomModel({
        room_type: item.room_type,
        room_numer: item.room_numer,
        alias: item.alias,
        extra: item.extra,
        description: item.description,
        capacity: item.capacity,
        aircondition: item.aircondition,
        meals: item.meals,
        mattress: item.mattress,
        image: item.image,
        price: item.price,
      });
      const content = await data.save();

      res.status(200).json(content);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/admin/addroom_from_list").post(async (req, res) => {
  try {
    const item = req.body;
    const data = new RoomModel({
      room_type: item.room_type,
      room_numer: item.room_numer,
      alias: item.alias,
      extra: item.extra,
      description: item.description,
      capacity: item.capacity,
      aircondition: item.aircondition,
      meals: item.meals,
      mattress: item.mattress,
      image: item.image,
      price: item.price,
    });
    const content = await data.save();
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/admin/addroomtype").post(async (req, res) => {
  try {
    const data = new RoomTypeModel({
      ...req.body,
    });
    const content = await data.save();
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/admin/deleteroom/:id").delete(async (req, res) => {
  try {
    const _id = req.params.id;
    await RoomModel.findByIdAndDelete({ _id });
    res.status(200).json({ msg: "successfull" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
routes.route("/admin/get_rooom/:id").get(async (req, res) => {
  try {
    const _id = req.params.id;
    const room = await RoomModel.findById({ _id })
      .populate("ratings")
      .populate("booking");
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(400).json({ msg: "room not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes
  .route("/room/filter/:from/:to/:roomtype/:capacity")
  .get(async (req, res) => {
    try {
      const _id = req.params.id;
      const from = req.params.from;
      const to = req.params.to;
      const roomtype = req.params.roomtype;
      const capacity = req.params.capacity;
      const room = await RoomModel.find({
        room_type: room_type,
        capacity: capacity,
      })
        .populate("ratings")
        .populate("booking");
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(400).json({ msg: "room not found" });
      }
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  });

routes.route("/admin/get_roooms").get(async (req, res) => {
  try {
    const room = await RoomModel.find({});
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(400).json({ msg: "room not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

const CheckAvailability = (bookeddate, leftdate, newdate) => {
  const startDate = new Date(bookeddate);
  const endDate = new Date(leftdate);
  const targetDate = new Date(newdate);
  if (targetDate >= startDate && targetDate <= endDate) {
    return false;
  } else {
    return true;
  }
};
routes
  .route("/client/get_available_rooms/:start/:type/:persons")
  .get(async (req, res) => {
    try {
      const startdate = req.params.start;
      const room_type = req.params.type;
      const persons = req.params.persons;
      let availableroom = [];

      const room = await RoomModel.find({}).populate("booking");

      if (room) {
        room.forEach((element) => {
          if (startdate === "any") {
            if (element.room_type === room_type) {
              availableroom.push(element);
            }
          } else if (
            element.room_type === room_type &&
            persons <= element.capacity
          ) {
            element.booking.forEach((data) => {
              if (CheckAvailability(data.from, data.to, startdate)) {
                availableroom.push(element);
              }
            });
            if (element.booking.length === 0) {
              availableroom.push(element);
            }
          } else if (
            room_type === "Any Room type" &&
            persons <= element.capacity
          ) {
            element.booking.forEach((data) => {
              if (CheckAvailability(data.from, data.to, startdate)) {
                availableroom.push(element);
              }
            });

            if (element.booking.length === 0) {
              availableroom.push(element);
            }
          }
        });

        res.status(200).json(availableroom);
      } else {
        res.status(400).json({ msg: "room not found" });
      }
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  });

routes.route("/admin/get_room_type").get(async (req, res) => {
  try {
    const rooms = await RoomTypeModel.find({});

    if (rooms) {
      res.status(200).json(rooms);
    } else {
      res.status(400).json({ msg: "room not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/admin/updateroom/:id").patch(async (req, res) => {
  try {
    const _id = req.params.id;

    await RoomModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      msg: "successfull",
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/client/book/rooms/:id/:user").post(async (req, res) => {
  try {
    const user_id = req.params.user;
    const room_id = req.params.id;
    const new_order = new BookingModel({
      ...req.body,
      from: new Date(req.body.from),
      to: new Date(req.body.to),
      client: user_id,
      room: room_id,
      room_id: room_id,
      orderId: generateRandomString(4),
    });

    const save_book = await new_order.save();
    if (save_book) {
      const userdata = await User.findById({ _id: user_id });
      if (userdata) {
        await Contactmail(
          userdata.email,
          `Congratulations,Payment successful for Order ID : ${save_book.orderId} room number ${save_book.room_number}, check In date is ${save_book.from}.Thank you for choosing Rixos hotel.Enjoy`
        );
      }

      await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $push: {
            bookings: save_book,
          },
        },
        { new: true, useFindAndModify: false }
      );
      await RoomModel.findByIdAndUpdate(
        { _id: room_id },
        {
          $push: {
            booking: save_book,
          },
        },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json(save_book);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
});

routes
  .route("/client/book/conference/available")
  .post(async (req, res, next) => {
    try {
      const date = req.body.date;
      const startTime = req.body.from;
      let available = false;

      const conferences = await ConferenceModel.find({});

      conferences.forEach((element) => {
        if (
          format(element.date, "eee dd MMM yyyy") ===
          format(new Date(date), "eee dd MMM yyyy")
        ) {
          if (isTimeBetween(element.from, element.to, startTime)) {
            available = true;
          }
        }
      });
      res.status(200).json({ msg: available });
    } catch (error) {
      res.status(400).json({ msg: error });
      console.log(error);
      next();
    }
  });

routes.route("/client/book/conference/:user").post(async (req, res) => {
  try {
    const user_id = req.params.user;

    const new_order = new ConferenceModel({
      ...req.body,
      client: user_id,
      date: new Date(req.body.date),
      orderId: generateRandomString(5),
    });

    const save_book = await new_order.save();

    if (save_book) {
      const userdata = await User.findById({ _id: user_id });
      if (userdata) {
        await Contactmail(
          userdata.email,
          `Congratulations,Payment successful for Order ID : ${save_book.orderId} .  check In date is ${save_book.date} from ${save_book.from} to ${save_book.to} .Thank you for choosing Rixos hotel.Enjoy`
        );
      }

      await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $push: {
            conference: save_book,
          },
        },
        { new: true, useFindAndModify: false }
      );

      res.status(200).json(save_book);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/conference_bookings").get(async (req, res) => {
  try {
    let TotalRevenue = 0;
    const order = await ConferenceModel.find({}).populate("client");

    if (order) {
      order.forEach((data) => {
        TotalRevenue = TotalRevenue + data.price;
      });
      res.status(200).json({ order, TotalRevenue });
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/conference_booking/:id").get(async (req, res) => {
  try {
    const order = await ConferenceModel.findById({
      _id: req.params.id,
    }).populate("client");
    if (order) {
      res.status(200).json(order);
    }
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/special_bookings").get(async (req, res) => {
  try {
    const order = await RooftopModel.find({}).populate("client");
    if (order) {
      res.status(200).json(order);
    }
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/special_book/update/:id").patch(async (req, res) => {
  try {
    const order = await RooftopModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(order);
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/rooms/booking/update/:id").patch(async (req, res) => {
  try {
    const order = await BookingModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(order);
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/conference/update/:id").patch(async (req, res) => {
  try {
    const order = await ConferenceModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(order);
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

// get room bookings
routes.route("/server/all_bookings").get(async (req, res) => {
  try {
    let TotalRevenue = 0;
    const order = await BookingModel.find({})
      .populate("client")
      .populate("room")
      .populate("rateme");
    if (order) {
      order.forEach((data) => {
        TotalRevenue = TotalRevenue + data.price;
      });
      res.status(200).json({ order, TotalRevenue });
    }
  } catch (error) {
    console.log({ error: error });
    res.status(400).json({ msg: error });
  }
});

routes.route("/server/getbooking/:id").get(async (req, res) => {
  try {
    const order = await BookingModel.findById({ _id: req.params.id })
      .populate("client")
      .populate("room")
      .populate("rateme");
    if (order) {
      res.status(200).json(order);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
/// Revanue Statistics

routes.route("/server/booking/statistics/:year").get(async (req, res) => {
  try {
    const targetY = req.params.year;
    const order = await BookingModel.find();
    let statDate = [
      {
        month: "January",
        totalRevenue: 1,
      },
      {
        month: "February",
        totalRevenue: 1,
      },
      {
        month: "March",
        totalRevenue: 1,
      },
      {
        month: "April",
        totalRevenue: 1,
      },
      {
        month: "May",
        totalRevenue: 1,
      },
      {
        month: "June",
        totalRevenue: 1,
      },
      {
        month: "July",
        totalRevenue: 1,
      },
      {
        month: "August",
        totalRevenue: 1,
      },
      {
        month: "September",
        totalRevenue: 1,
      },
      {
        month: "October",
        totalRevenue: 1,
      },
      {
        month: "November",
        totalRevenue: 1,
      },
      {
        month: "December",
        totalRevenue: 1,
      },
      {
        pendingOrder: 0,
        checkedIn: 0,
        totalRevenue: 0,
        Mtnmomopayment: 0,
        cardpayment: 0,
      },
    ];
    if (order) {
      order.forEach((data) => {
        let newdate = new Date(data.from);
        const orderYear = newdate.getFullYear();
        const monthZeroBased = newdate.getMonth();
        const monthOneBased = monthZeroBased + 1;

        if (data.paymentoption === "Mtn Mobile Money (momo)") {
          statDate[12].Mtnmomopayment = statDate[12].Mtnmomopayment + 1;
        } else {
          statDate[12].cardpayment = statDate[12].cardpayment + 1;
        }
        if (orderYear === parseInt(targetY)) {
          statDate[12].totalRevenue = statDate[12].totalRevenue + data.price;
          if (data.status === "pending") {
            statDate[12].pendingOrder = statDate[12].pendingOrder + 1;
          }
          if (data.status === "Checked In") {
            statDate[12].checkedIn = statDate[12].checkedIn + 1;
          }

          if (monthOneBased === 1) {
            statDate[0].totalRevenue = statDate[0].totalRevenue + data.price;
          }
          if (monthOneBased === 2) {
            statDate[1].totalRevenue = statDate[1].totalRevenue + data.price;
          }
          if (monthOneBased === 3) {
            statDate[2].totalRevenue = statDate[2].totalRevenue + data.price;
          }
          if (monthOneBased === 4) {
            statDate[3].totalRevenue = statDate[3].totalRevenue + data.price;
          }
          if (monthOneBased === 5) {
            statDate[4].totalRevenue = statDate[4].totalRevenue + data.price;
          }
          if (monthOneBased === 6) {
            statDate[5].totalRevenue = statDate[5].totalRevenue + data.price;
          }

          if (monthOneBased === 7) {
            statDate[6].totalRevenue = statDate[6].totalRevenue + data.price;
          }
          if (monthOneBased === 8) {
            statDate[7].totalRevenue = statDate[7].totalRevenue + data.price;
          }
          if (monthOneBased === 9) {
            statDate[8].totalRevenue = statDate[8].totalRevenue + data.price;
          }
          if (monthOneBased === 10) {
            statDate[9].totalRevenue = statDate[9].totalRevenue + data.price;
          }
          if (monthOneBased === 11) {
            statDate[10].totalRevenue = statDate[10].totalRevenue + data.price;
          }
          if (monthOneBased === 12) {
            statDate[11].totalRevenue = statDate[11].totalRevenue + data.price;
          }
        }
        // Get the month (1-based)
      });
      statDate.forEach((data, index) => {
        if (index !== 0) {
          let prevRev = statDate[index - 1].totalRevenue;
          let differenceRev = data.totalRevenue - prevRev;
          let indicator = (differenceRev / prevRev) * 100;
          statDate[index].growth_indicator = indicator.toFixed(1);
        }
      });

      res.status(200).json(statDate);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
});
/// filter bookings
routes
  .route(
    "/server/bookings/filter/:room_no/:customer/:order_id/:startdate/:enddate"
  )
  .get(async (req, res, next) => {
    try {
      const startdate = req.params.startdate;
      const enddate = req.params.enddate;
      const room_no = req.params.room_no;
      const customername = req.params.customer;
      const order_id = req.params.order_id;
      const newstartdate = new Date(startdate);
      const newenddate = new Date(enddate);

      let filter = {
        createdAt: { $gt: new Date(newstartdate),
        $lt:new Date(newenddate) },
      };

      let TotalRevenue = 0;

      if (
        room_no !== "null" &&
        customername !== "null" &&
        order_id !== "null"
      ) {
        filter.orderId = order_id;
        filter.customername = customername;
        filter.room_number = room_no;
      } else if (
        room_no === "null" &&
        customername !== "null" &&
        order_id !== "null"
      ) {
        filter.orderId = order_id;
        filter.customername = customername;
      } else if (
        room_no === "null" &&
        customername === "null" &&
        order_id !== "null"
      ) {
        filter.orderId = order_id;
      } else if (
        room_no !== "null" &&
        customername !== "null" &&
        order_id === "null"
      ) {
        filter.customername = customername;
        filter.room_number = room_no;
      } else if (
        room_no !== "null" &&
        customername === "null" &&
        order_id === "null"
      ) {
        filter.room_number = room_no;
      } else if (
        room_no !== "null" &&
        customername === "null" &&
        order_id !== "null"
      ) {
        filter.orderId = order_id;
        filter.room_number = room_no;
      } else if (
        room_no === "null" &&
        customername !== "null" &&
        order_id === "null"
      ) {
        filter.customername = customername;
      }
      console.log({ log: filter });
      const order = await BookingModel.find(filter).populate("client").populate("room").populate("rateme");
      console.log(order)
      if (order) {
        order.forEach((data) => {
          TotalRevenue = TotalRevenue + data.price;
        });
        res.status(200).json({ order, TotalRevenue });
      }
    } catch (error) {
      res.status(400).json({ msg: error });
      next();
    }
  });

/// Revanue Statistics conference

routes.route("/server/conference/statistics/:year").get(async (req, res) => {
  try {
    const targetY = req.params.year;
    const order = await ConferenceModel.find();
    let statDate = [
      {
        month: "January",
        totalRevenue: 1,
      },
      {
        month: "February",
        totalRevenue: 1,
      },
      {
        month: "March",
        totalRevenue: 1,
      },
      {
        month: "April",
        totalRevenue: 1,
      },
      {
        month: "May",
        totalRevenue: 1,
      },
      {
        month: "June",
        totalRevenue: 1,
      },
      {
        month: "July",
        totalRevenue: 1,
      },
      {
        month: "August",
        totalRevenue: 1,
      },
      {
        month: "September",
        totalRevenue: 1,
      },
      {
        month: "October",
        totalRevenue: 1,
      },
      {
        month: "November",
        totalRevenue: 1,
      },
      {
        month: "December",
        totalRevenue: 1,
      },
      {
        pendingOrder: 0,
        checkedIn: 0,
        totalRevenue: 0,
        Mtnmomopayment: 0,
        cardpayment: 0,
      },
    ];
    if (order) {
      order.forEach((data) => {
        let newdate = new Date(data.date);
        const orderYear = newdate.getFullYear();
        const monthZeroBased = newdate.getMonth();
        const DayName = newdate.getDay();

        const monthOneBased = monthZeroBased + 1;

        if (data.paymentoption === "Mtn Mobile Money (momo)") {
          statDate[12].Mtnmomopayment = statDate[12].Mtnmomopayment + 1;
        } else {
          statDate[12].cardpayment = statDate[12].cardpayment + 1;
        }
        if (orderYear === parseInt(targetY)) {
          statDate[12].totalRevenue = statDate[12].totalRevenue + data.price;
          if (data.status === "pending") {
            statDate[12].pendingOrder = statDate[12].pendingOrder + 1;
          }
          if (data.status === "Checked In") {
            statDate[12].checkedIn = statDate[12].checkedIn + 1;
          }

          if (monthOneBased === 1) {
            statDate[0].totalRevenue = statDate[0].totalRevenue + data.price;
          }
          if (monthOneBased === 2) {
            statDate[1].totalRevenue = statDate[1].totalRevenue + data.price;
          }
          if (monthOneBased === 3) {
            statDate[2].totalRevenue = statDate[2].totalRevenue + data.price;
          }
          if (monthOneBased === 4) {
            statDate[3].totalRevenue = statDate[3].totalRevenue + data.price;
          }
          if (monthOneBased === 5) {
            statDate[4].totalRevenue = statDate[4].totalRevenue + data.price;
          }
          if (monthOneBased === 6) {
            statDate[5].totalRevenue = statDate[5].totalRevenue + data.price;
          }

          if (monthOneBased === 7) {
            statDate[6].totalRevenue = statDate[6].totalRevenue + data.price;
          }
          if (monthOneBased === 8) {
            statDate[7].totalRevenue = statDate[7].totalRevenue + data.price;
          }
          if (monthOneBased === 9) {
            statDate[8].totalRevenue = statDate[8].totalRevenue + data.price;
          }
          if (monthOneBased === 10) {
            statDate[9].totalRevenue = statDate[9].totalRevenue + data.price;
          }
          if (monthOneBased === 11) {
            statDate[10].totalRevenue = statDate[10].totalRevenue + data.price;
          }
          if (monthOneBased === 12) {
            statDate[11].totalRevenue = statDate[11].totalRevenue + data.price;
          }
        }
        // Get the month (1-based)
      });
      statDate.forEach((data, index) => {
        if (index !== 0) {
          let prevRev = statDate[index - 1].totalRevenue;
          let differenceRev = data.totalRevenue - prevRev;
          let indicator = (differenceRev / prevRev) * 100;
          statDate[index].growth_indicator = indicator.toFixed(1);
        }
      });

      res.status(200).json(statDate);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
    console.log(error);
  }
});

/// filter conference bookings
routes
  .route("/server/conference/filter/:customer/:order_id/:startdate/:enddate")
  .get(async (req, res, next) => {
    try {
      const startdate = req.params.startdate;
      const enddate = req.params.enddate;
      const customername = req.params.customer;
      const order_id = req.params.order_id;
      const newstartdate = new Date(startdate);
      const newenddate = new Date(enddate);

      let filter = {
        date: { $gt: new Date(newstartdate) },
      };

      let TotalRevenue = 0;

      if (customername !== "null" && order_id !== "null") {
        filter.orderId = order_id;
        filter.customername = customername;
      } else if (customername === "null" && order_id !== "null") {
        filter.orderId = order_id;
      } else if (customername !== "null" && order_id == "null") {
        filter.customername = customername;
      }

      const order = await ConferenceModel.find(filter).populate("client");

      if (order) {
        order.forEach((data) => {
          TotalRevenue = TotalRevenue + data.price;
        });
        res.status(200).json({ order, TotalRevenue });
      }
    } catch (error) {
      res.status(400).json({ msg: error });
      next();
    }
  });

routes.route("/client/book/rateme/:id/:user").post(async (req, res) => {
  try {
    const user_id = req.params.user;
    const book_id = req.params.id;
    const new_rate = new RatemeModel({
      ...req.body,
      client: user_id,
      order: book_id,
    });

    const save_rate = await new_rate.save();
    if (save_rate) {
      const getorder = await BookingModel.findById({ _id: book_id });
      if (getorder) {
        const _roomid = getorder.room_id;
        await RoomModel.findByIdAndUpate(
          { _id: _roomid },
          {
            $push: {
              ratings: save_rate,
            },
          },

          { new: true, useFindAndModify: false }
        );
      }

      res.status(200).json(save_book);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
routes.route("/rooms/get_ratings").get(async (req, res) => {
  try {
    const content = await RatemeModel.find({})
      .populate("client")
      .populate("order");
    if (content) {
      res.status(200).json(content);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

routes.route("/rooms/add_testimony/:id").post(async (req, res) => {
  try {
    const content = await TestimonialModel.findOne();

    if (content) {
      await TestimonialModel.findByIdAndUpate(
        ({ _id: content._id },
        {
          $push: {
            testimony: req.params.id,
          },
        })
      );
      res.status(200).json({ msg: "added successfully" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

routes.route("/rooms/remove_testimony/:id").post(async (req, res) => {
  try {
    const content = await TestimonialModel.findOne();

    if (content) {
      await TestimonialModel.findByIdAndUpate(
        ({ _id: content._id },
        {
          $pull: {
            testimony: req.params.id,
          },
        })
      );
      res.status(200).json({ msg: "remove successfully" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = routes;
