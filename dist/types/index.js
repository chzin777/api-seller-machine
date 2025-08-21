"use strict";
/**
 * Tipos personalizados para a aplicação TSAPI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.HttpStatus = void 0;
// Enums
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCodes["NOT_FOUND"] = "NOT_FOUND";
    ErrorCodes["DUPLICATE_ENTRY"] = "DUPLICATE_ENTRY";
    ErrorCodes["FOREIGN_KEY_CONSTRAINT"] = "FOREIGN_KEY_CONSTRAINT";
    ErrorCodes["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
