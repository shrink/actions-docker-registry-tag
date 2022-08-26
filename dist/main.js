"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const utils_1 = require("./utils");
/**
 * Main
 */
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let token = core.getInput('token');
    /**
     * GHCR
     */
    if (core.getInput('registry') === 'ghcr.io') {
        token = Buffer.from(token).toString('base64');
    }
    /**
     * Image
     */
    const image = {
        registry: {
            domain: core.getInput('registry'),
            token
        },
        target: {
            repository: core.getInput('repository'),
            tag: core.getInput('target')
        }
    };
    /**
     * Tags
     */
    const tags = core.getInput('tags').split('\n');
    /**
     * Add Tags
     */
    const results = yield (0, utils_1.addTags)(image, tags);
    /**
     * Check status
     */
    results.forEach((result) => {
        if (result.success === true) {
            core.info(`${image.target.repository}:${image.target.tag} tagged with ${result.tag}`);
            return;
        }
        core.setFailed(`${image.target.repository}:${image.target.tag} could not be tagged with ${result.tag}`);
    });
});
/**
 * Entry point
 */
try {
    main();
}
catch (error) {
    core.setFailed(error.message);
}
