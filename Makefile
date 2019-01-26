include Makefile.inc

DST_DIR := deployment/polpware-fe-data/src
SRC_DIR := projects/polpware/fe-data/src/lib

PACKAGE_SOURCES := $(SRC_DIR)/interfaces/event-args.interface.ts \
 $(SRC_DIR)/interfaces/joint-point.interface.ts \
 $(SRC_DIR)/interfaces/observable.interface.ts \
 $(SRC_DIR)/interfaces/backbone.interface.ts \
 $(SRC_DIR)/interfaces/ng-zone-like.interface.ts \
 $(SRC_DIR)/decorators/observable.decorator.ts \
 $(SRC_DIR)/cache/cache-backend.interface.ts \
 $(SRC_DIR)/cache/memory-backend.ts \
 $(SRC_DIR)/cache/sliding-expiration-cache.ts \
 $(SRC_DIR)/cache/sliding-expire-cache.interface.ts \
 $(SRC_DIR)/relational/dummy-records.ts \
 $(SRC_DIR)/relational/interfaces.ts \
 $(SRC_DIR)/relational/table.ts \
 $(SRC_DIR)/relational/database.ts \
 $(SRC_DIR)/backend/interfaces.ts \
 $(SRC_DIR)/backend/event-hub.ts \
 $(SRC_DIR)/backend/provider.ts \
 $(SRC_DIR)/backend/aggregate-collection.ts \
 $(SRC_DIR)/i18n/dict.ts \
 $(SRC_DIR)/i18n/resource-loader.ts \
 $(SRC_DIR)/security/interfaces.ts \
 $(SRC_DIR)/security/policy-base.ts \
 $(SRC_DIR)/security/oauth-token-policy.ts \
 $(SRC_DIR)/security/oauth-token-ext-policy.ts \
 $(SRC_DIR)/security/open-id-policy.ts \
 $(SRC_DIR)/security/user-credential.ts \
 $(SRC_DIR)/security/null-policy.ts \
 $(SRC_DIR)/security/antiforgerykey-policy.ts \
 $(SRC_DIR)/net/xhr-promise.ts \
 $(SRC_DIR)/net/curl.ts \
 $(SRC_DIR)/generic-store/collection-action-def.ts \
 $(SRC_DIR)/generic-store/collection-store.interface.ts \
 $(SRC_DIR)/generic-store/collection.store.ts \
 $(SRC_DIR)/generic-store/collection-abstract.store.ts \
 $(SRC_DIR)/generic-store/factory.ts \
 $(SRC_DIR)/generic-store/reducers/collection.reducer.ts \
 $(SRC_DIR)/generic-store/reducers/index.ts \
 $(SRC_DIR)/storage/localstorage-util.ts \
 $(SRC_DIR)/storage/localstorage-table.ts


PACKAGE_TARGETS := $(subst $(SRC_DIR),$(DST_DIR),$(PACKAGE_SOURCES))

# rules

$(DST_DIR)/decorators/%.ts: $(SRC_DIR)/decorators/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/interfaces/%.ts: $(SRC_DIR)/interfaces/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/cache/%.ts: $(SRC_DIR)/cache/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/relational/%.ts: $(SRC_DIR)/relational/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/backend/%.ts: $(SRC_DIR)/backend/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/net/%.ts: $(SRC_DIR)/net/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/security/%.ts: $(SRC_DIR)/security/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/generic-store/%.ts: $(SRC_DIR)/generic-store/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/storage/%.ts: $(SRC_DIR)/storage/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

$(DST_DIR)/i18n/%.ts: $(SRC_DIR)/i18n/%.ts
	$(ECHO) Making a file $@ from $<
	$(MKDIR) -p $(dir $@)
	$(CP) $(CPFlALGS) $< $@

prepare_dir:
	echo "Preparing directory ..."
#	rm -rf $(DST_DIR)
	echo "Generating src ..."

$(PACKAGE_TARGETS): | prepare_dir

publish: $(PACKAGE_TARGETS)

test:
	echo $(PACKAGE_SOURCES)
	echo $(PACKAGE_TARGETS)

.PHONY: publish test

# deployment

BuildDist := ./dist/polpware/fe-data
BuildDoc := ./docs
DeployTarget := ./deployment/polpware-fe-data

include Makefile.deployment
