const { model, set } = require("mongoose");
const {
  RoomModel,
  BookingModel,
  RatemeModel,
  TestimonialModel,
  RoomTypeModel,
} = require("../models/Database");
const { sortArticles, generateRandomString } = require("../middleware/utils");
const express = require("express");
const { User } = require("../models/users");
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
        //       console.log(availableroom);
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
    console.log(req.body);
    const user_id = req.params.user;
    const room_id = req.params.id;
    const new_order = new BookingModel({
      ...req.body,
      client: user_id,
      room: room_id,
      room_id: room_id,
      orderId: generateRandomString(4),
    });

    const save_book = await new_order.save();
    if (save_book) {
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

routes.route("/server/all_bookings").get(async (req, res) => {
  try {
    const order = await BookingModel.find({})
      .populate("client")
      .populate("room")
      .populate("rateme");

    if (order) {
      res.status(200).json(order);
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
