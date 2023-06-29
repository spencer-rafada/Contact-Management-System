var express = require("express");
var router = express.Router();

const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contact");

router.get("/", (req, res, next) => {
  Contact.find()
    .populate("group")
    .then((contact) => {
      res.status(200).json({
        message: "Contacts fetched successfully",
        documents: contact,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

router.post("/", (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId("contacts");

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group,
  });

  contact
    .save()
    .then((createdContact) => {
      res.status(201).json({
        message: "Contact added successfully",
        document: createdContact,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "An error occured", error: error });
    });
});

router.put("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      contact.subject = req.body.subject;
      contact.msgText = req.body.msgText;
      contact.sender - req.body.sender;

      Contact.updateOne({ id: req.params.id }, contact)
        .then((result) => {
          res.status(204).json({ message: "Contact updated successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: "An error occured", error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Contact not found",
        error: { document: "Contact not found" },
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((message) => {
      Contact.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(204).json({ message: "Contact deleted successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: "An error occured", error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Contact not found",
        error: { document: "Contact not found" },
      });
    });
});

module.exports = router;
