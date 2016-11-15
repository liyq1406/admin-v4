<template>
  <div class="panel mt20 pdb30">
    <div class="panel-bd">
      <!-- 第一步骤 -->
      <validator name="validation">
        <div v-if="currPage === 1">
          <!-- <step-form1></step-form1> -->
          <div class="recipe-form">
            <div class="main-title bordered">
              <h2>1.填写菜谱基本信息</h2>
            </div>
            <div class="form with-loading pad0">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <form autocomplete="off" novalidate @submit.prevent="onRecipeSubmit">
                <div class="panel mt30 mb30 bordered">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> {{ $t("ui.recipe.fields.name") }}:</label>
                      <div class="controls col-21">
                        <div v-placeholder="'请填写菜谱名称'" class="input-text-wrap">
                          <input v-model="name" type="text" name="name" v-validate:name="{required: true, maxlength: 20, format: 'trim'}" lazy class="input-text"/>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.ingredient.fields.name')}) }}</span>
                          <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.ingredient.fields.name'), 20]) }}</span>
                          <span v-if="$validation.name.touched && $validation.name.format">菜谱名称不允许前后带空格</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"> {{ $t("ui.ingredient.fields.images") }}:</label>
                      <div class="controls col-21">
                        <div class="thumb-info">
                          <div class="thumb">
                            <image-uploader :images="images" @modified="onModifiedImages(images)"></image-uploader>
                            <!-- <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div> -->
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> 介绍:</label>
                      <div class="controls col-21">
                        <div class="thumb-info">
                          <div class="">
                            <div class="input-text-wrap" style="height:100%">
                              <textarea v-model="instructions" style="height:100%" type="text" lazy placeholder="说说这道菜的介绍吧" v-validate:instructions="{required: true, maxlength: 60}" class="input-text"></textarea>
                            </div>
                            <div class="form-tips form-tips-error">
                              <span v-if="$validation.instructions.touched && $validation.instructions.required">{{ $t('ui.validation.required', {field: '介绍'}) }}</span>
                              <span v-if="$validation.instructions.modified && $validation.instructions.maxlength">{{ $t('ui.validation.maxlength', ['介绍', 60]) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">时长:</label>
                      <div class="controls col-21">
                        <div class="select-group">
                          <div class="select">
                            <x-select width="160px" placeholder="请选择时间" :label="properties.cooking_time">
                              <select v-model="properties.cooking_time" name="properties.cooking_time">
                                <option v-for="opt in cookingtimes" :value="opt" :selected="cookingtimes===opt">{{ opt }}</option>
                              </select>
                            </x-select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">难度:</label>
                      <div class="controls col-21">
                        <div class="select-group">
                          <div class="select">
                            <x-select width="160px" placeholder="请选择难度" :label="properties.difficulty">
                              <select v-model="properties.difficulty" name="properties.difficulty">
                                <option v-for="opt in difficulties" :value="opt" :selected="properties.difficulty===opt">{{ opt }}</option>
                              </select>
                            </x-select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">{{ $t("ui.ingredient.fields.classification") }}:</label>
                      <div class="controls col-21">
                        <div class="select-group1" v-for="category in classification">
                          <div class="select">
                            <x-select width="160px" class="dis" placeholder="请选择父类别" :label="category.main.name">
                              <select v-model="category.main" @change="getSubCategories(category, true)">
                                <option v-for="opt in mainCategories" :value="opt.main">{{ opt.main.name }}</option>
                              </select>
                            </x-select>
                            <x-select v-show="category.subOptions.length" width="160px" class="dis" placeholder="请选择子类别" :label="category.sub.name">
                              <select v-model="category.sub">
                                <option v-for="opt in category.subOptions" :value="opt.sub">{{ opt.sub.name }}</option>
                              </select>
                            </x-select>
                            <span @click="removeObj(category, classification)" class="fa fa-times ml10"></span>
                          </div>
                        </div>
                        <button @click.prevent="addCategory" class="btn btn-primary"><i class="fa fa-plus"></i>添加类别</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel mb20 bordered">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i>主料:</label>
                      <div class="col-20 row">
                        <div class="col-12 mb10" v-for="major in major_ingredients">
                          <div class="row">
                            <div class="col-12">
                              <div class="input-text-wrap">
                                <input placeholder="请填写材料" v-model="major.name" type="text" name="major.name" lazy class="input-text" :field="'majorname' + $index" v-validate="{required: true, maxlength: 20}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['majorname' + $index].touched && $validation['majorname' + $index].required">主料名称不能为空</span>
                                <span v-if="$validation['majorname' + $index].modified && $validation['majorname' + $index].maxlength">{{ $t('ui.validation.maxlength', ['主料名称', 20]) }}</span>
                              </div>
                            </div>
                            <div class="col-8 col-offset-1">
                              <div class="input-text-wrap">
                                <input placeholder="用量" v-model="major.unit" type="text" name="major.unit" lazy class="input-text" :field="'majorunit' + $index" v-validate="{required: true, maxlength: 10}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['majorunit' + $index].touched && $validation['majorunit' + $index].required">主料用量不能为空</span>
                                <span v-if="$validation['majorunit' + $index].modified && $validation['majorunit' + $index].maxlength">{{ $t('ui.validation.maxlength', ['主料用量', 10]) }}</span>
                              </div>
                            </div>
                            <div class="col-3">
                              <span v-if="major_ingredients.length > 1" @click="removeObj(major, major_ingredients)" class="fa fa-times m10"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="operations col-offset-3">
                        <button @click.prevent="addMajor" class="btn btn-primary" :class="{'disabled': major_ingredients.length === 20}" :disabled="major_ingredients.length === 20" ><i class="fa fa-plus"></i>添加主料</button>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i>辅料:</label>
                      <div class="col-20 row">
                        <div class="col-12 mb10" v-for="minor in minor_ingredients">
                          <div class="row">
                            <div class="col-12">
                              <div class="input-text-wrap">
                                <input placeholder="请填写材料" v-model="minor.name" type="text" name="minor.name" lazy class="input-text" :field="'minorname' + $index" v-validate="{required: true, maxlength: 20}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['minorname' + $index].touched && $validation['minorname' + $index].required">辅料名称不能为空</span>
                                <span v-if="$validation['minorname' + $index].modified && $validation['minorname' + $index].maxlength">{{ $t('ui.validation.maxlength', ['辅料名称', 20]) }}</span>
                              </div>
                            </div>
                            <div class="col-8 col-offset-1">
                              <div class="input-text-wrap">
                                <input placeholder="用量" v-model="minor.unit" type="text" name="minor.unit" lazy class="input-text" :field="'minorunit' + $index" v-validate="{required: true, maxlength: 10}"/>
                              </div>
                              <div class="form-tips form-tips-error">
                                <span v-if="$validation['minorunit' + $index].touched && $validation['minorunit' + $index].required">辅料用量不能为空</span>
                                <span v-if="$validation['minorunit' + $index].modified && $validation['minorunit' + $index].maxlength">{{ $t('ui.validation.maxlength', ['辅料用量', 10]) }}</span>
                              </div>
                            </div>
                            <div class="col-3">
                              <span v-if="minor_ingredients.length > 1" @click="removeObj(minor, minor_ingredients)" class="fa fa-times m10"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="operations col-offset-3">
                        <button @click.prevent="addMinor" class="btn btn-primary" :class="{'disabled': minor_ingredients.length === 20}" :disabled="minor_ingredients.length === 20"><i class="fa fa-plus"></i>添加辅料</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="panel mb20">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3"><i class="hl-red">*</i> 烹饪技巧:</label>
                      <div class="controls col-21">
                        <div v-placeholder="$t('ui.recipe.placeholders.skill')" class="input-text-wrap">
                          <textarea v-model="tips" type="text" name="tips" v-validate:tips="{required: true, maxlength: 100}" lazy class="input-text"></textarea>
                        </div>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.tips.touched && $validation.tips.required">{{ $t('ui.validation.required', {field: '烹饪技巧'}) }}</span>
                          <span v-if="$validation.tips.modified && $validation.tips.maxlength">{{ $t('ui.validation.maxlength', ['烹饪技巧', 100]) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <label class="form-control col-3">标签:</label>
                      <div class="controls col-21">
                        <tag-input :value.sync="tag" :limit=20 :input-disabled="true" :candidate="candidateTags" :editing.sync="editingTag" @adding-tag="show = true"></tag-input>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="panel mb20">
                  <div class="panel-bd">
                    <div class="form-row row">
                      <label class="form-control col-3">状态:</label>
                      <div class="controls col-21">
                        <div class="radio-group">
                          <label class="radio">
                            <input type="radio" v-model="status" name="is_enable" :value="1"/>已发布
                          </label>
                          <label class="radio">
                            <input type="radio" v-model="status" name="is_enable" :value="0"/>待审核
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <!-- <div class="form-actions mb40 row">
                  <div class="col-offset-4">
                    <button type="submit" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
                    <button @click.prevent.stop="isShowPreview=true" class="btn btn-ghost btn-lg">预览</button>
                    <button @click.prevent="deleteRecipe" class="btn btn-ghost btn-lg" v-if="type==='edit'">{{ $t('ui.recipe.del') }}</button>
                  </div>
                </div> -->
              </form>
            </div>
          </div>
        </div>
        <!-- 第一步骤END -->
        <!-- 第二步骤 -->
        <div v-if="currPage === 2">
          <!-- <step-form2></step-form2> -->
          <div class="recipe-form">
            <div class="main-title bordered">
              <h2>2.添加烹饪步骤</h2>
            </div>
            <div class="form with-loading">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <form autocomplete="off" novalidate @submit.prevent="onRecipeSubmit">
                <div class="form-row panel mb20">
                  <div class="panel-bd">
                    <div v-for="cooking_step in cooking_steps" class="thumb-info mt20 mb15 row">
                      <div class="col-3">第{{ $index+1 }}步:</div>
                      <div class="col-21">
                        <div class="thumb">
                          <image-uploader :images="cooking_step.images" @modified="onModifiedImages(cooking_step.images)" class="mb0"></image-uploader>
                        </div>
                        <div class="info-text">
                          <div class="input-text-wrap">
                            <textarea v-model="cooking_step.description" type="text" lazy placeholder="请填写步骤的描述" class="input-text" :field="'step' + $index" v-validate="{required: true, maxlength: 100}"></textarea>
                          </div>
                          <div class="form-tips form-tips-error">
                            <span v-if="$validation['step' + $index].touched && $validation['step' + $index].required">步骤描述不能为空</span>
                            <span v-if="$validation['step' + $index].modified && $validation['step' + $index].maxlength">{{ $t('ui.validation.maxlength', ['步骤描述', 100]) }}</span>
                          </div>

                          <div class="button-list">
                            <div v-show="cooking_steps.length>1&&$index>0" @click="handleStepEvent('MOVE_UP', cooking_step, $index)" class="control-button button-up"><i class="icon fa fa-long-arrow-up"></i></div>
                            <div v-show="cooking_steps.length>1&&$index<(cooking_steps.length-1)" @click="handleStepEvent('MOVE_DOWN', cooking_step, $index)" class="control-button button-down"><i class="icon fa fa-long-arrow-down"></i></div>
                            <div @click="handleStepEvent('ADD', cooking_step, $index)" class="control-button button-add" v-if="cooking_steps.length<maxStepCount"><i class="icon fa fa-plus"></i></div>
                            <div v-show="cooking_steps.length>1" @click="handleStepEvent('DEL', cooking_step, $index)" class="control-button button-del"><i class="icon fa fa-times"></i></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="bortop" v-if="this.$route.params.type_value === '2'">
                  <h2>添加设备烹饪提示</h2>
                  <div class="row">
                    <div class="line32 mrb10" v-for="tip in cookTips">
                      <div class="col-3">第{{ $index+1 }}步:</div>
                      <div class="col-19">
                        <p class="cooktipp">{{tip.content}}</p>
                      </div>
                      <div class="col-2">
                        <a @click.prevent.stop="setCookTip(tip)">编辑</a>
                      </div>
                    </div>
                    <div class="row">
                      <button @click.prevent.stop="addTips" class="col-offset-3 btn btn-ghost addCookTip"><i class="fa fa-plus">添加烹饪提示步骤</i></button>
                    </div>
                  </div>
                </div> -->
              </form>
              <modal :show.sync="cookTipShow" width="480px">
                <h3 slot="header">编辑烹饪提示信息</h3>
                <div slot="body" class="form">
                  <form autocomplete="off" novalidate @submit.prevent="">
                    <div class="form-row row">
                      <label class="form-control col-6">提示信息:</label>
                      <div class="controls col-18">
                        <div class="input-text-wrap required-sign">
                          <textarea v-model="setTipModel.content" name="content" type="text" class="input-text"></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="form-actions">
                      <label class="del-check">
                        <input type="checkbox" name="del" v-model="delChecked"/> 删除此提示
                      </label>
                      <button type="submit" class="btn btn-primary">确定</button>
                      <button @click.prevent.stop="cookTipShow = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
                    </div>
                  </form>
                </div>
              </modal>
            </div>

          </div>
        </div>
        <!-- 第二步骤END -->
        <!-- 第三步骤 -->
        <div v-if="currPage === 3">
          <div class="recipe-form">
            <div class="main-title bordered">
              <h2>3.填写菜谱烹饪参数</h2>
            </div>
            <div class="form with-loading">
              <div class="icon-loading" v-show="loadingData">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div>
            <form autocomplete="off" novalidate @submit.prevent="onRecipeSubmit">
              <div class="recipe-form">
                <div class="form with-loading">
                  <div class="icon-loading" v-show="loadingData">
                    <i class="fa fa-refresh fa-spin"></i>
                  </div>
                  <div class="row">
                    <label class="form-control col-3 line32">烹饪设备: </label>
                    <div class="controls col-21">
                      <x-select :label="currentProduct.name" width="180px">
                        <select v-model="currentProduct" @change="">
                          <option v-for="product in products" :value="product">{{product.name}}</option>
                        </select>
                      </x-select>
                    </div>
                  </div>
                  <div class="row mrt10">
                    <label class="form-control col-3 line32">本地菜谱ID: </label>
                    <div class="controls col-21">
                      <div class="input-text-wrap">
                        <input type="text" v-model="local_id" style="width:300px" class="input-text" name="local_id" v-validate:localid="{required: true, format: 'trim'}"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.localid.touched && $validation.localid.required">请输入本地菜谱ID</span>
                        <!-- <span v-if="$validation.localid.modified && $validation.localid.maxlength">本地菜谱ID不能超过20位</span> -->
                        <span v-if="$validation.localid.touched && $validation.localid.format">菜谱ID不允许前后带空格</span>
                      </div>
                    </div>
                  </div>
                  <div class="settingArea row">
                    <label class="col-3 line32">菜单:</label>
                    <div class="controls col-21">
                      <!-- <tree-item></tree-item> -->
                      <ul class="menu" v-if="menus && menus.length > 0">
                        <tree-item  v-for="menu in menus" :menu="menu" :index="$index" @push-data="test" @push-code-data="setCode" @delete-menu="deleteMenu" @delete-code="deleteCode"></tree-item>
                      </ul>
                    </div>
                  </div>
                  <div class="form-actions row">
                    <div class="col-offset-4">
                      <button @click.prevent.stop="openFirAdd" class="btn btn-ghost"><i class="fa fa-plus"></i>添加菜单</button>
                      <button @click.prevent.stop="openFirCodeAdd" class="btn btn-ghost"><i class="fa fa-plus"></i>添加烹饪参数</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="form-actions mb40 row">
                <div class="col-offset-4">
                  <button type="submit" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
                  <button @click.prevent="deleteRecipe" class="btn btn-ghost btn-lg" v-if="type==='edit'">{{ $t('ui.recipe.del') }}</button>
                </div>
              </div> -->
            </form>

            <!-- 添加第一级菜单 -->
            <modal :show.sync="addFirMenuShow" width="480px">
              <h3 slot="header">添加菜单</h3>
              <div slot="body" class="form">
                <!-- <form autocomplete="off" novalidate>
                  <div class="form-row row" v-if="addFirMenuShow">
                    <label class="form-control col-6">菜单名称:</label>
                    <div class="controls col-18">
                      <div class="input-text-wrap">
                        <input v-model="addMenuModal.type" name="addMenuModal.type" type="text" class="input-text" lazy>
                      </div>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button @click.prevent.stop="addFirstMenu" class="btn btn-primary">确定</button>
                    <button @click.prevent.stop="cancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
                  </div>
                </form> -->
                <menu-form v-if="addFirMenuShow" :type="add" :menu={} @submit="addFirstMenu" @close="cancel"></menu-form>
              </div>
            </modal>
            <!-- 添加一级烹饪参数 -->
            <modal :show.sync="addFirCodeShow" width="480px">
              <h3 slot="header">添加烹饪参数</h3>
              <div slot="body" class="form">
                <code-form v-if="addFirCodeShow" :type="codeType" :menu="codeClone" @submit="pushCode" @close="closeCode"></code-form>
              </div>
            </modal>
          </div>
        </div>
        <!-- 第三步骤END -->
        <!-- 第四步骤 -->
        <div v-if="currPage === 4">
          <div class="panel mt20">
            <!-- <div class="panel-hd">
              <h2>烹饪设备列表</h2>
            </div> -->
            <div class="panel-bd">
              <div class="tips-null" v-if="!recipe.devices.length && !loadingData">您还没有关联烹饪设备，请点击“添加烹饪设备”按钮编辑智能菜谱数据</div>
              <div class="data-table with-loading" v-if="recipe.devices.length">
                <div class="icon-loading" v-show="loadingData">
                  <i class="fa fa-refresh fa-spin"></i>
                </div>
                <div v-for="device in recipe.devices">
                  <h3>{{ device.name }}</h3>
                  <table class="table table-stripe table-bordered">
                    <thead>
                      <tr>
                        <th colspan="2" class="wp30">烹饪曲线设备</th>
                        <th class="w5 tac">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="w5">指令类型</td>
                        <td><span class="hl-red">{{ device.autoexec.type || '-' }}</span></td>
                        <td class="w5 tac"><a class="hl-red" @click.prevent="editType(device)">编辑</a></td>
                      </tr>
                      <tr>
                        <td class="w5">烹饪指令</td>
                        <td><span class="hl-red">{{ device.autoexec.value || '-' }}</span></td>
                        <td class="w5 tac"><a class="hl-red" @click.prevent="editInstructions(device)">编辑</a></td>
                      </tr>
                      <tr>
                        <th colspan="3" class="">烹饪提示</th>
                      </tr>
                      <tr v-for="tip in device.prompts">
                        <td class="w5">第{{ $index + 1 }}步</td>
                        <td><span v-if="tip.prompt_text"  class="hl-red">{{ tip.prompt_text }}</span><span class="graytip" v-if="!tip.prompt_text">请输入提示内容,如:请将食物翻面</span></td>
                        <td class="w5 tac"><a class="hl-red" @click.prevent="addTips(device, 'edit', tip)">编辑</a></td>
                      </tr>
                      <tr>
                        <td class="w5"> </td>
                        <td><a class="hl-red" @click.prevent="addTips(device, 'add')">+添加烹饪提示步骤</a></td>
                        <td class="w5 tac"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn-primary" @click="addDevice" :disabled="recipe.devices.length >= products.length" :class="{'disabled':recipe.devices.length >= products.length}"><i class="fa fa-plus"></i>添加烹饪设备</button>
            </div>

            <modal :show.sync="modal.show" @close="onCancel" width="480px">
              <h3 slot="header">{{ modal.type === 'add' ? '添加' : '编辑' }}烹饪设备</h3>
              <div slot="body" class="form">
                <device-form v-if="modal.show" :recipe="recipe" :name="name" :type="modal.type" @add="deviceSubmit" @close="modal.show = false"></device-form>
              </div>
            </modal>
            <!-- 编辑类型begin -->
            <modal :show.sync="showType" @close="onTypeCancel" width="480px">
              <h3 slot="header">编辑烹饪设置</h3>
              <div slot="body" class="form">
                <form autocomplete="off" novalidate @submit.prevent="onTypeEdit">
                  <div class="form-row row">
                    <label class="form-control col-6">指令类型:</label>
                    <div class="radio-group controls col-18">
                      <label v-for="type in types" class="radio">
                        <input type="radio" v-model="typeModal.type" name="typeModal.type" :value="type" number required/>{{ type }}
                      </label>
                    </div>
                  </div>
                  <div class="form-actions">
                    <!-- <label v-if="modal.type === 'edit'" class="del-check">
                      <input type="checkbox" name="del" v-model="delChecked"/> 删除此设备
                    </label> -->
                    <button type="submit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
                    <button @click.prevent.stop="onTypeCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
                  </div>
                </form>
              </div>
            </modal>
            <!-- 指令编辑 -->
            <modal :show.sync="instructionsShow" width="480px">
              <h3 slot="header">编辑烹饪设置</h3>
              <div slot="body" class="form">
                <instructions-form v-if="instructionsShow" :model="instructionsModal" @submit="editIns" @delete="deleteIns" @close="onInsCancel"></instructions-form>
              </div>
            </modal>
            <!-- 指令提示 -->
            <modal :show.sync="tipsShow" width="480px">
              <h3 slot="header"><span v-if="this.tipsType === 'add'">添加</span><span v-if="this.tipsType === 'edit'">编辑</span>烹饪提示</h3>
              <div slot="body" class="form">
                <tips-form v-if="tipsShow" :type="tipsType" :model="tipsModal" @submit="editTips" @delete="delTips" @close="onTipsCancel"></tips-form>
              </div>
            </modal>
          </div>
        </div>
      </validator>
      <!-- 第四步骤END -->
      <div v-show="isShowPreview" transition="modal" class="mask">
        <div class="preview-wrapper">
          <div :style="dialogStyle" class="preview-dialog">
            <div class="preview-header">
              <h3>预览</h3>
            </div>
            <div class="preview-body">
              <div class="app-header">{{ name }}</div>
              <div class="preview-thumb">
                <img :src="images[0]">
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <h3>{{name}}</h3>
                </div>
                <div class="preview-panel-bd">
                  <p class="introduce">{{ instructions }}</p>
                  <div class="metas">
                    <div class="meta"><i class="fa fa-hand-pointer-o"></i> {{properties.difficulty}}</div>
                    <div class="meta"><i class="fa fa-clock-o"></i> {{properties.cooking_time}}</div>
                  </div>
                </div>
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <div class="preview-panel-hd-actions"><span>添加到我的菜篮</span></div>
                  <h3>用料：</h3>
                </div>
                <div class="preview-panel-bd">
                  <table>
                    <tbody>
                      <tr v-for="ingredient in major_ingredients">
                        <td>{{ ingredient.name }}</td>
                        <td>{{ ingredient.unit }}</td>
                      </tr>
                      <tr v-for="ingredient in minor_ingredients">
                        <td>{{ ingredient.name }}</td>
                        <td>{{ ingredient.unit }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="preview-panel">
                <div class="preview-panel-hd">
                  <h3>步骤：</h3>
                </div>
                <div class="preview-panel-bd">
                  <p v-for="step in cooking_steps">
                    <span class="previewstep">第{{$index+1}}/{{cooking_steps.length}}步</span>
                    <span>{{step.description}}</span>
                    <image class="previewpic" :src="step.images[0]"></image>
                  </p>
                </div>
              </div>
              <div class="preview-panel">
                <ul class="introlist">
                  <li><i class="fa fa-star"></i> 收藏菜谱</li>
                  <li><i class="fa fa-plus-circle"></i> 添加到我的常用菜</li>
                </ul>
              </div>
              <div class="preview-panel device-panel">
                <h4>选择厨具并开始烹饪</h4>
                <div class="cooking-devices">
                  <div class="cooking-device-item device1"></div>
                  <div class="cooking-device-item device2"></div>
                </div>
              </div>
            </div>
            <span @click="dismiss" class="fa fa-times-circle"></span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="maxPage" class="panel mb20">
      <div class="panel-bd">
        <div class="form-row row">
          <label class="form-control col-3">状态:</label>
          <div class="controls col-21">
            <div class="radio-group">
              <label class="radio">
                <input type="radio" v-model="status" name="is_enable" :value="1"/>已发布
              </label>
              <label class="radio">
                <input type="radio" v-model="status" name="is_enable" :value="0"/>待审核
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row border-top">
      <div class="col-21 col-offset-3">
        <button v-if="!minPage" class="btn btn-primary btn-lg mlr10" @click.prevent="lastStep">上一步</button>
        <button v-if="maxPage" class="btn btn-primary btn-lg mlr10" @click.prevent.stop="onRecipeSubmit">提交</button>
        <button v-if="!maxPage" class="btn btn-primary btn-lg mlr10" @click.prevent="nextStep">下一步</button>
        <button v-if="maxPage" class="btn btn-ghost btn-lg mlr10" @click.prevent.stop="isShowPreview=true">预览</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { pluginMixins } from '../../../mixins'
import TreeItem from './TreeItem'
import DeviceForm from './DeviceForm'
import InstructionsForm from '../components/InstructionsForm'
import TipsForm from '../components/TipsForm'
import MenuForm from './MenuForm'
import CodeForm from '../components/CodeForm'

export default {
  name: 'Creation',

  layout: 'admin',

  mixins: [pluginMixins],

  components: {
    CodeForm,
    MenuForm,
    'tree-item': TreeItem,
    DeviceForm,
    InstructionsForm,
    TipsForm
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember,
      products: ({ products }) => products.released
    }
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      addFirCodeShow: false,
      codeClone: {},
      codeType: 'add',
      deviceModel: {},
      instructionsShow: false,
      instructionsModal: {},
      tipsShow: false,
      tipsModal: {},
      tipsType: 'add',
      showType: false,
      typeModal: {},
      recipe: {
        name: '',
        devices: []
      },
      selectedType: 'HEX',
      types: ['HEX', 'base64', 'json'],
      addFirMenuShow: false,
      local_id: '',
      addMenuModal: {
        type: '',
        name: ''
      },
      menus: [],
      currentProduct: {},
      name: '',
      images: [''], // 成品图
      difficulty: '不限',
      instructions: '',
      cooking_steps: [{
        description: '',
        time: '',
        images: ['']
      }],
      properties: {
        user_cooking_time: '',
        cooking_time: '5分钟',
        difficulty: '不限',
        label: ''
      },
      mainCategories: [],
      classification: [],
      tips: '',
      tag: '',
      editingTag: false,
      show: false,
      difficulties: ['不限', '新手', '初级', '中级', '高级', '厨神'],
      cookingtimes: ['5分钟', '10分钟', '15分钟', '30分钟', '60分钟', '90分钟', '2小时', '数小时', '1天', '数天'],
      major_ingredients: [{name: '', unit: ''}],
      minor_ingredients: [{name: '', unit: ''}],
      devices: [],
      // allDevices: DEVICES,
      allDevices: '',
      // candidateTags: locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS,
      candidateTags: [],
      adding: false,
      status: 1,
      isShowPreview: false,
      maxStepCount: 15,
      modal: {
        show: false,
        type: 'add'
      },
      submitType: 'add',
      isShowModal: false,
      selectedProduct: {},
      originModel: {
        id: '',
        name: '',
        autoexec: ''
      },
      model: {},
      submitting: false,
      delChecked: false,
      loadingData: true,
      breadcrumbNav: [{
        label: '运营商列表',
        link: '/dev/settings/message/custom-carrier'
      }, {
        label: '添加运营商'
      }],
      currPage: 1,
      // 页码在数组里的索引位置
      arrNum: 0,
      pages: [],
      lastAble: false,
      nextAble: true,
      cookTips: [
        {
          content: ''
        }
      ],
      cookTipShow: false,
      setTipModel: {
        content: ''
      }
    }
  },
  computed: {
    productOptions () {
      return _.differenceBy(this.products, this.recipe.devices, 'id')
    },
    // 判断当前是否第一页
    minPage () {
      var result = true
      if (this.currPage === 1) {
        //
        result = true
      } else {
        result = false
      }
      return result
    },
    // 判断当前是否最后一页
    maxPage () {
      var result = false
      if (this.currPage === this.pages[this.pages.length - 1]) {
        // 如果跟页码数组最后一项相同，说明为最后一页
        result = true
      } else {
        result = false
      }
      return result
    }
  },

  ready () {
    this.init()
    // this.getRecipes()
    this.whichPage()
    let appId = this.$route.params.app_id
    // 从 localStorage 中获取app token
    let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

    if (this.type === 'add') { // 添加
      this.classification = [{
        main: {id: '', name: ''},
        sub: {id: '', name: ''},
        subOptions: []
      }]
    } else { // 编辑
      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        query: {
          _id: this.$route.params.id
        }
      }
      api.recipes.getRecipes(appId, token, condition).then((res) => {
        if (res.status === 200) {
          var data = res.data.list[0] ? res.data.list[0] : null

          this.name = data.name
          this.instructions = data.instructions
          this.properties.cooking_time = data.properties.cooking_time
          this.properties.difficulty = data.properties.difficulty
          this.tag = data.properties.label ? data.properties.label.join(',') : ''
          this.major_ingredients = data.major_ingredients
          this.minor_ingredients = data.minor_ingredients
          this.cooking_steps = data.cooking_steps
          this.tips = data.tips
          if (data.param) {
            this.menus = data.param
          }
          this.local_id = data.local_id
          this.devices = data.devices
          this.status = data.status
          var images = ['']
          data.images.forEach((item, index) => {
            images[index] = item
          })
          this.images = images

          // TODO
          _.forEach(data.classification, (item) => {
            this.getSubCategories(item)
            this.classification.push(item)
          })
        }
      })
    }

    // 获取所有菜谱分类
    this.getMainCategories()
    // 获取所有标签
    this.getTags()
  },

  watch: {
    products () {
      this.init()
    }
  },

  methods: {
    setCode (val, index) {
      console.log(index)
      console.log(val)
      this.menus.$set(index, val)
      console.log(JSON.stringify(this.menus))
      // this.menu = val
    },
    // 控制页码逻辑
    whichPage () {
      if (this.$route.params.type_value === '1') {
        // 如果菜谱类型为普通菜谱
        this.pages = [1, 2]
      } else if (this.$route.params.type_value === '2') {
        // 如果菜谱类型为智能菜谱
        this.pages = [1, 2, 4]
      } else if (this.$route.params.type_value === '3') {
        // 如果菜谱类型为本地菜谱
        this.pages = [1, 2, 3]
      }
      this.currPage = this.pages[0]
      this.arrNum = 0
    },
    // 上一页功能
    lastStep () {
      this.arrNum -= 1
      this.currPage = this.pages[this.arrNum]
    },

    // 下一页功能
    nextStep () {
      if (this.$validation.invalid) {
        this.$validate(true)
        this.showNotice({
          type: 'error',
          content: '请确认填写是否正确！'
        })
        return
      }
      this.arrNum += 1
      this.currPage = this.pages[this.arrNum]
    },

    /**
     * 处理图片上传
     * @param  {Array} images 图片路径数组
     */
    onModifiedImages (images, data) {
      images = data
    },

    /**
     * 获取菜谱分类
     * @author shengzhi
     */
    getCategories (id, limit) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      let condition = {
        limit: limit,
        query: {
          parent_id: id
        }
      }

      this.loadingData = true
      return api.recipes.getCategories(appId, token, condition)
    },

    /**
     * 获取父级分类
     * @author shengzhi
     */
    getMainCategories () {
      this.getCategories(0, 50).then((res) => {
        if (res.status !== 200) {
          this.loadingData = false
          return
        }
        this.mainCategories = res.data.list.map((item) => {
          return {
            main: {
              id: item._id,
              name: item.name
            }
          }
        })
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取子级分类
     * @author shengzhi
     * @param {Object} parent 父级
     */
    getSubCategories (parent, trigger) {
      if (trigger) {
        parent.sub = {id: '', name: ''}
      }
      parent.subOptions = []
      this.getCategories(parent.main.id, 500).then((res) => {
        if (res.status !== 200) {
          this.loadingData = false
          return
        }
        this.loadingData = false
        parent.subOptions = res.data.list.map((item) => {
          return {
            sub: {
              id: item._id,
              name: item.name
            }
          }
        })
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 获取标签
     */
    getTags () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let condition = {
        limit: 200,
        query: {}
      }

      this.loadingData = true
      api.recipes.getTags(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.candidateTags = res.data.list.map((item) => {
            return item.label
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 添加菜谱类别
     */
    addCategory () {
      this.classification.push({
        main: {id: '', name: ''},
        sub: {id: '', name: ''},
        subOptions: []
      })
    },

    /**
     * 添加主料
     */
    addMajor () {
      var newMajor = {}
      newMajor.name = ''
      newMajor.unit = ''
      this.major_ingredients.push(newMajor)
    },

    /**
     * 添加辅料
     */
    addMinor () {
      var newMinor = {}
      newMinor.name = ''
      newMinor.unit = ''
      this.minor_ingredients.push(newMinor)
    },

    /**
     * 设置步骤
     * @param {Objcet} device 设备
     */
    setSteps (device) {
      var arr = []
      for (var i = 0, len = device.count; i < len; i++) {
        if (i < device.steps.length) {
          arr[i] = _.cloneDeep(device.steps[i])
        } else {
          arr[i] = _.cloneDeep(this.allDevices[device.id].template)
        }
      }
      device.steps = arr
    },

    /**
     * 菜谱步骤右边四个小操作按钮的事件
     * @param  {[type]} step      当前操作的步骤对象
     * @param  {[type]} index     当前操作的步骤index
     * @param  {[type]} eventType 事件类型，用来区分四个按钮的四个事件
     * @return {[type]}           无返回
     */
    handleStepEvent (eventType, step, index) {
      var newstep = {
        description: '',
        time: 0,
        images: ['']
      }
      switch (eventType) {
        case 'MOVE_UP':
          this.cooking_steps.splice(index, 1)
          this.cooking_steps.splice(index - 1, 0, step)
          break
        case 'MOVE_DOWN':
          this.cooking_steps.splice(index, 1)
          this.cooking_steps.splice(index + 1, 0, step)
          break
        case 'ADD':
          this.cooking_steps.splice(index + 1, 0, newstep)
          break
        case 'DEL':
          if (!window.confirm('您确定要删除该步骤？')) return
          this.cooking_steps.$remove(step)
          break
        default:
          break
      }
    },

    /**
     * 通用删除事件
     * @param  {Object} obj 要删除的对象
     * @param  {Array}  arr 要删除的对象的父数组
     */
    removeObj (obj, arr) {
      if (arr.length <= 1) {
        this.showNotice({
          type: 'error',
          content: '默认项不允许删除'
        })
        return
      }
      arr.$remove(obj)
    },

    // 关闭预览
    dismiss () {
      this.isShowPreview = false
    },

    /**
     * 菜谱表单提交
     */
    onRecipeSubmit () {
      if (this.editing) return

      if (this.$validation.invalid) {
        this.$validate(true)
        this.showNotice({
          type: 'error',
          content: '请确认填写是否正确！'
        })
        return
      }
      if (this.$route.params.type_value === '3') {
        if (!this.local_id) {
          alert('请填写本地菜谱ID！')
          return
        }
      }
      if (this.$route.params.type_value === '2') {
        if (!this.recipe.devices.length) {
          alert('请添加烹饪设备！')
          return
        }
      }

      if (this.major_ingredients.length === 1 && !this.major_ingredients[0].name) {
        alert('请填写主料！')
        return
      }

      if (this.minor_ingredients.length === 1 && !this.minor_ingredients[0].name) {
        alert('请填写辅料！')
        return
      }

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      this.editing = true
      let images = _.compact(_.clone(this.images))
      let major = this.major_ingredients.filter((item) => {
        return Object.keys(item).length > 0
      })
      let minor = this.minor_ingredients.filter((item) => {
        return Object.keys(item).length > 0
      })
      let classification = []
      _.forEach(this.classification, (item) => {
        if (!item.main.id) return
        classification.push({
          main: item.main,
          sub: item.sub
        })
      })
      let params = {
        name: this.name,
        images: images,
        instructions: this.instructions,
        properties: {
          cooking_time: this.properties.cooking_time,
          difficulty: this.properties.difficulty,
          label: _.compact(this.tag.split(','))
        },
        devices: this.recipe.devices,
        classification: classification,
        major_ingredients: major,
        minor_ingredients: minor,
        cooking_steps: this.cooking_steps,
        tips: this.tips,
        status: this.status,
        creator: this.currentMember.name,
        local_id: this.local_id,
        param: this.menus,
        pid: [this.currentProduct.id],
        // type: this.devices.length ? 2 : 1
        type: this.$route.params.type_value
      }

      let process
      let noticeCont = ({
        add: '菜谱添加成功！',
        edit: '菜谱修改成功！'
      })[this.submitType]

      if (this.submitType === 'edit') {
        process = api.recipes.editRecipes(appId, this.$route.params.id, token, params)
      } else {
        process = api.recipes.addRecipes(appId, token, params)
      }

      process.then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: noticeCont
          })
          this.$route.router.go({path: '/operation/plugins/recipes/' + this.$route.params.app_id + '/recipes'})
        }
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
    },

    addDevice () {
      this.modal = {
        show: true,
        type: 'add'
      }
      this.model = _.clone(this.originModel)
    },
    deviceSubmit (obj) {
      this.recipe.devices.push(obj)
      this.modal.show = false
    },

    editDevice (device) {
      this.modal = {
        show: true,
        type: 'edit'
      }
      this.model = {
        id: device.id,
        name: device.name,
        autoexec: device.autoexec.value
      }
    },
    editType (device) {
      this.showType = true
      this.typeModal = {
        device: device,
        type: device.autoexec.type
      }
    },

    editInstructions (device) {
      this.instructionsShow = true
      this.instructionsModal = {
        device: device,
        value: device.autoexec.value
      }
    },
    addTips (device, type, tip) {
      this.tipsShow = true
      this.tipsType = type
      this.tipsModal = {
        device: device,
        tip: tip,
        prompt_text: ''
      }
      if (type === 'edit') {
        this.tipsModal.prompt_text = tip.prompt_text
      }
    },
    // 添加提示
    editTips (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      var lesno = this.recipe.devices[no].prompts.indexOf(obj.tip)
      if (this.tipsType === 'add') {
        this.recipe.devices[no].prompts.push({prompt_text: obj.prompt_text, index: this.recipe.devices[no].prompts.length + 1})
        this.onTipsCancel()
        // this.editOthers('edit')
      } else if (this.tipsType === 'edit') {
        this.recipe.devices[no].prompts[lesno].prompt_text = obj.prompt_text
        this.recipe.devices[no].prompts[lesno].index = lesno + 1
        this.onTipsCancel()
        // this.editOthers('edit')
      }
    },
    delTips (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      var lesno = this.recipe.devices[no].prompts.indexOf(obj.tip)
      this.recipe.devices[no].prompts.splice(lesno, 1)
      this.onTipsCancel()
      // this.editOthers('edit')
    },
    onTipsCancel () {
      this.tipsShow = false
    },

    onCancel () {
      this.modal.show = false
      this.selectedProduct = {}
      this.delChecked = false
      this.$resetValidation()
    },
    onTypeCancel () {
      this.showType = false
    },
    // 编辑类型
    onTypeEdit () {
      // console.log(JSON.stringify(this.typeModal))
      // 当前索引
      // console.log(this.recipe.devices.indexOf(this.typeModal.device))
      var no = this.recipe.devices.indexOf(this.typeModal.device)
      this.recipe.devices[no].autoexec.type = this.typeModal.type
      this.onTypeCancel()
      // this.editOthers('edit')
    },
    // 编辑指令
    editIns (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      this.recipe.devices[no].autoexec.value = obj.value
      this.onInsCancel()
      // this.editOthers('edit')
    },
    // 删除指令
    deleteIns (obj) {
      alert(123)
      var result = window.confirm('确认删除该设备烹饪设备?')
      if (result === true) {
        var no = this.recipe.devices.indexOf(obj.device)
        // this.recipe.devices[no] = obj.value
        this.recipe.devices.splice(no, 1)
        this.onInsCancel()
        // this.editOthers('edit')
      } else {
        return
      }
    },
    onInsCancel () {
      this.instructionsShow = false
    },

    /**
     * 删除菜谱
     */
    deleteRecipe () {
      if (!window.confirm('确定要删除该菜谱吗？')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.recipes.delRecipes(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜谱删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/recipes/${this.$route.params.app_id}/recipes`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setCookTip (item) {
      this.cookTipShow = true
      this.setTipModel = item
    },
    // addTips () {
    //   this.cookTips.push({content: ''})
    // },
    addMenu (item) {
      // window.alert(JSON.stringify(item))
      this.addMenuShow = true
    },
    openFirAdd () {
      this.addMenuModal.type = ''
      this.addFirMenuShow = true
      // this.$resetValidation()
    },
    // 创建一级菜单
    addFirstMenu (obj) {
      // if (this.$validation.invalid) {
      //   return
      // }
      // if (!(this.addMenuModal.type.trim())) {
      //   alert('请输入菜单名称！')
      //   return
      // }
      this.menus.push({
        type: obj.type
      })
      this.addFirMenuShow = false
      this.addMenuModal.type = ''
    },
    openFirCodeAdd () {
      this.addFirCodeShow = true
    },
    // 创建一级烹饪参数
    pushCode (model) {
      this.menus.push({
        name: model.name,
        desc: model.desc,
        param_id: model.param_id
      })
      this.addFirCodeShow = false
    },
    // 创建子菜单
    addChildrenMenu () {
      // if (this.$validation.invalid) {
      //   return
      // }
      this.menus.push({
        type: this.addMenuModal.type
      })
      // this.addMenuModal = _.clone(this.originAddModel)
      this.addFirMenuShow = false
      this.addMenuModal.type = ''
      // this.$resetValidation()
    },
    editMenu (item) {
      this.editMenuShow = true
    },
    addCode (item) {
      this.addCodeShow = true
    },
    editCode (item) {
      this.editCodeShow = true
    },
    cancel () {
      // console.log(this)
      // this.$resetValidation()
      this.addFirMenuShow = false
    },
    closeCode () {
      this.addFirCodeShow = false
    },
    test (val, index) {
      console.log(index)
      console.log(val)
      this.menus.$set(index, val)
      console.log(JSON.stringify(this.menus))
      // this.menu = val
    },
    deleteMenu (val, index, deleted) {
      if (index >= 0 && !deleted) {
        this.menus.splice(index, 1)
      }
      console.log('最终')
      console.log(JSON.stringify(this.menus))
    },
    deleteCode (val, index, codeDeleted) {
      if (index >= 0 && !codeDeleted) {
        codeDeleted = true
        this.menus.splice(index, 1)
      }
    },
    /**
     * 初始化
     */
    init () {
      if (this.products && this.products.length > 0) {
        this.currentProduct = this.products[0]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../../../assets/stylus/common'
  .previewstep
    display block
    font-size 16px
  .previewpic
    width 280px
    height 210px
    display block
    margin-left auto
    margin-right auto
  .graytip
    color #a9a9a9
  .menu
    position relative
    left -35px
  .actions
    margin-top 20px
    margin-bottom 20px
  .w5
    width 5%
  .tips-null
    text-align center
    border 1px solid default-border-color
  .settingArea
    margin-top 10px
  .mrt10
    margin-top 10px
  .line32
    line-height 32px
    height 32px
  .mrb10
    margin-bottom 10px
  .cooktipp
    width 100%
    border 1px solid #ddd
    box-sizing border-box
    margin 0
    height 32px
    line-height 32px
  .addCookTip
    margin-top 10px
  .line32
    line-height 32px
    height 32px
  .mrb10
    margin-bottom 10px
  .cooktipp
    width 100%
    border 1px solid #ddd
    box-sizing border-box
    margin 0
    height 32px
    line-height 32px
  .addCookTip
    margin-top 10px
  .bortop
    border-top 1px solid #ddd
    /*padding-top 20px*/
  .action
    border-top 1px solid #ddd
    padding-top 20px
  .mlr10
    margin 0 10px 0 10px
  .pdb30
    padding-bottom 30px!important
  .panel-bd.form
    padding 0!important
  .pad0
    padding 0!important

  // 图文
  .thumb-info
    width 100%
    position relative
    clearfix()
    label.form-control
      float left
      text-align right
      /*width 70px*/
      line-height 120px
      /*padding-right 20px*/
      box-sizing border-box
    .controls-image
      float left
      width 182px
      min-width 182px
      overflow hidden

      .image-uploader-item
        margin-bottom 0
    .thumb
      float left
      width 170px

      .image-uploader-item
        margin-bottom 0
    .info-text
      margin-left 170px
      box-sizing border-box
      height 120px
      position relative
      .input-text-wrap
      .input-text
        height 100%
    .button-list
      absolute right -30px top
      height 120px
      opacity 0
      /*transition opacity ease 0.3s*/
      .control-button
        height 25px
        width 25px
        line-height 25px
        margin-bottom 6px
        background #999
        text-align center
        cursor pointer
        &:hover
          background red
        i.icon
          color #fff
    &:hover
      .button-list
        opacity 1

  /*预览*/
  .mask
    fixed left top
    size 100%
    background rgba(0, 0, 0, .6)
    z-index 1000
    display table
    transition opacity .2s ease

    .preview-wrapper
      display table-cell
      vertical-align middle

    .preview-dialog
      position relative
      background rgba(255, 255, 255, .95)
      margin 0 auto
      width 320px
      box-shadow 0 2px 8px rgba(0, 0, 0, .3)
      transition all .3s ease

      .fa-times-circle
        absolute right top 3px
        size 40px
        line-height 40px
        text-align center
        cursor pointer
        font-size 16px
        color #666
        transition color .3s

        &:hover
          color red

    .preview-header
      padding 10px 20px
      border-bottom 1px solid #DDD

      h3
        font-weight normal
        color gray-darker
        margin 0

    .preview-body
      max-height 540px
      overflow-y auto
      box-sizing border-box
      background-color #F2F2F2

      .app-header
        font-size 18px
        text-align center
        padding 10px 0
        border-bottom 1px solid default-border-color
        background-color #fff
      .preview-thumb
        /*width 380px*/
        height 200px
        margin-bottom 10px
        img
          width 100%
          height 100%
      .preview-panel
        background #FFF
        padding 0 10px
        margin-bottom 10px
      .preview-panel-hd
        font-size 12px
        margin-bottom 10px
        padding 10px 0
        border-bottom 1px solid light-border-color

        .preview-panel-hd-actions
          float right

          span
            display inline-block
            background #999
            color #FFF
            line-height 20px
            padding 0 10px
            border-radius 20px

        h3
          font-size 14px
          margin 0
      .preview-panel-bd
        font-size 12px
        padding-bottom 10px

        table
          width 100%
          td
            padding 5px 0

      .device-panel
        padding 1px 0 15px

      .introduce
        margin 0
        border-bottom 1px solid light-border-color
        padding-bottom 10px

      .metas
        padding-top 10px
        clearfix()

        .meta
          float left
          width 50%
          text-align center
      .introlist
        clearfix()
        margin-top 5px
        li
          float left
          width 50%
          text-align center
          padding 10px 0
          line-height 25px
          height 25px
      .posdiv
        position relative
        padding-bottom 10px
        border-bottom 1px solid #999
        margin-bottom 10px
        span
          display inline-block
          position absolute
          right 5px
          background-color #999
          font-size 12px
          padding 3px 10px
          border-radius 10px
          color #fff
      h4
        text-align center
      .foolist
        clearfix()
        li
          float left
          width 50%
          text-align left
      .table
        margin 0

      // 错误信息
      .error-msg
        text-align center
        margin-bottom 30px

    .cooking-devices
      text-align center

      .cooking-device-item
        display inline-block
        size 64px
        background-color #F3F3F3
        background-repeat no-repeat
        background-position center center
        border-radius 40px
        margin 0 15px

      .device1
        background-image url('../assets/images/device_1.png')

      .device2
        background-image url('../assets/images/device_2.png')

    .preview-actions
        text-align center

        .btn
          width 120px

    .preview-footer
      padding 0 30px 20px
      text-align right
      clearfix()
      /*end*/
  .panel
    padding-bottom 5px
  .previewForm
    display table-cell
    vertical-align middle
  .dis
    display inline-block
  .m10
    margin 10px
  .childinblock div
    display inline-block
    margin-top 5px
    margin-left 5px
  .recipe-form
    .form
      max-width 800px
      .form-row
        max-height 5000px
        .fa-times
          cursor pointer
        .controls
          .select-group1
            position relative
            width 400px
            margin 0 10px 10px 0
            padding-right 30px
          .input-text-wrap
            input.input-text-time
              border 1px solid default-border-color
              display inline-block
              width 120px
              box-sizing border-box
              font-size 14px
              height 32px
              line-height 32px
              padding 6px 20px
              margin-right 10px
            span.text-time
              margin-right 10px

      // 设备列表
      .device-list
        .device-list-item
          position relative
          font-size 12px

          .device-name
            font-size 14px
            font-weight bold
            line-height 26px

          .cooking-time
            line-height 26px

            .input-text-wrap
              display inline-block

              .input-text
                font-size 12px
                size 90px 26px
                line-height 24px
                padding 0 5px

          .fa-times
            font-size 14px
            size 24px
            line-height 24px
            background rgba(255, 0, 0, .5)
            color #FFF
            text-align center
            z-index 100

        .step-list-item
          margin 20px 0
          border 1px solid default-border-color
          padding 0 0 10px 10px

          .step-num
            text-align center

            span
              position relative
              display inline-block
              line-height 24px
              padding 0 20px
              border 1px solid default-border-color
              border-radius 20px
              font-weight bold
              background #FFF
              top -13px
  // 浮窗
  .modal
    .modal-body
      clearfix()
      .status-bar
        padding 0
        border 0
        .x-select
          float left
          display inline-block
          padding-left 10px
        .search-box
          float right

    .to-select-list
      width 65%
      float left

    .pager
      margin-top 10px

    .selected-list
      width 33%
      float right
      border 1px solid light-border-color
      box-sizing border-box
      background #FFF

      h3
        font-size 14px
        padding 0 20px
        line-height 35px
        margin 0
        border-bottom 1px solid #e4e4e4

      ul
        margin 0
        max-height 310px
        list-style none
        overflow auto

      li
        border-bottom 1px solid #e4e4e4
        font-size 12px
        position relative
        line-height 30px
        padding 0 20px

        .fa
          height 100%
          top 0
          line-height 30px

        &:nth-child(2n-1)
          background #F9F9F9

        &:last-child
          border-bottom none

    .button-box
      width 100%
      box-sizing border-box
      text-align right
      .btn
        margin-left 10px
</style>
