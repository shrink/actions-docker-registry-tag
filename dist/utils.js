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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTags = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const core = __importStar(require("@actions/core"));
/**
 * Manifest URL
 */
const manifestUrl = (image, tag) => {
    const url = `https://${image.registry.domain}/v2/${image.target.package}/manifests/${tag}`;
    console.log(`URL: ${url}`);
    return url;
};
/**
 * Add Tags
 */
const addTags = (image, tags) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Types
     */
    const manifestTypes = [
        'docker.distribution.manifest.v1',
        'docker.distribution.manifest.v2',
        'docker.distribution.manifest.list.v2',
        'oci.image.manifest.v1',
        'oci.image.index.v1'
    ];
    /**
     * Headers
     */
    const headers = {
        authorization: `Bearer ${image.registry.token}`,
        accept: manifestTypes.map(type => `application/vnd.${type}+json`).join(',')
    };
    /**
     * Manifest
     */
    const manifest = yield (0, node_fetch_1.default)(manifestUrl(image, image.target.target), {
        method: 'GET',
        headers
    });
    /**
     * Check status
     */
    if (manifest.status !== 200) {
        core.debug((yield manifest.json()));
        throw new Error(`${image.target.package}:${image.target.target} not found.`);
    }
    const mediaType = manifest.headers.get('Content-Type');
    const targetManifest = yield manifest.text();
    /**
     * Set Content-Type
     */
    Object.assign(headers, {
        'Content-Type': mediaType
    });
    /**
     * Add Tags
     */
    return yield Promise.all(tags.map((tag) => __awaiter(void 0, void 0, void 0, function* () {
        /**
         * Remove `^v` at the beginning if tag is version
         */
        tag = tag.replace(/^v/, '');
        const result = yield (0, node_fetch_1.default)(manifestUrl(image, tag), {
            method: 'PUT',
            headers,
            body: targetManifest
        });
        return { tag, success: result.status === 201 };
    })));
});
exports.addTags = addTags;
