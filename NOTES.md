# Dev Notes

## Decisions

### IDs

Using the name of a card as the primary id.

Considered:

- cid, or card id, as a serial number. 0 = bark etc
  - string works
- iid, or instance id, as a way to two otherwise identical but separate cards apart.
  - should be able to use indexes
- version, may need these later for foil / promo cards


### Deps

- immer: trying it out, as I'd like to use it more. Also fits more with how I think about things. 