import { Protocol } from "../shared/protocol.js";
import { InitializedNotificationSchema, InitializeRequestSchema, PROTOCOL_VERSION, ListResourcesRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, SetLevelRequestSchema, } from "../types.js";
/**
 * An MCP server on top of a pluggable transport.
 *
 * This server will automatically respond to the initialization flow as initiated from the client.
 */
export class Server extends Protocol {
    /**
     * Initializes this server with the given name and version information.
     */
    constructor(_serverInfo) {
        super();
        this._serverInfo = _serverInfo;
        this.setRequestHandler(InitializeRequestSchema, (request) => this._oninitialize(request));
        this.setNotificationHandler(InitializedNotificationSchema, () => { var _a; return (_a = this.oninitialized) === null || _a === void 0 ? void 0 : _a.call(this); });
    }
    async _oninitialize(request) {
        if (request.params.protocolVersion !== PROTOCOL_VERSION) {
            throw new Error(`Client's protocol version is not supported: ${request.params.protocolVersion}`);
        }
        this._clientCapabilities = request.params.capabilities;
        this._clientVersion = request.params.clientInfo;
        return {
            protocolVersion: PROTOCOL_VERSION,
            capabilities: this.getCapabilities(),
            serverInfo: this._serverInfo,
        };
    }
    /**
     * After initialization has completed, this will be populated with the client's reported capabilities.
     */
    getClientCapabilities() {
        return this._clientCapabilities;
    }
    /**
     * After initialization has completed, this will be populated with information about the client's name and version.
     */
    getClientVersion() {
        return this._clientVersion;
    }
    getCapabilities() {
        return {
            prompts: this._requestHandlers.has(ListPromptsRequestSchema.shape.method.value)
                ? {}
                : undefined,
            resources: this._requestHandlers.has(ListResourcesRequestSchema.shape.method.value)
                ? {}
                : undefined,
            tools: this._requestHandlers.has(ListToolsRequestSchema.shape.method.value)
                ? {}
                : undefined,
            logging: this._requestHandlers.has(SetLevelRequestSchema.shape.method.value)
                ? {}
                : undefined,
        };
    }
}
//# sourceMappingURL=index.js.map