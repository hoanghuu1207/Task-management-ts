import { Request, Response } from "express";

import Task from "../models/task.model";
import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";

//[GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
  interface Find{
    deleted: boolean,
    status?: string,
    title?: RegExp
  }

  const find: Find = {
    deleted: false
  }

  if(req.query.status){
    find.status = req.query.status.toString();
  }

  const sort = {};

  if(req.query.sortKey && req.query.sortValue){
    const sortKey = req.query.sortKey.toLocaleString();
    // const sortKey = req.query.sortKey.toString();
    sort[sortKey] = req.query.sortValue;
  }
  
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);

  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );

  let objectSearch = searchHelper(req.query);

  if(req.query.keyword){
    find.title = objectSearch.regex;
  }

  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  res.json(tasks);
}

//[GET] /api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });

  res.json(task);
}

//[PATCH] /api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try{
    const id: string = req.params.id;
    const status: string = req.body.status;

    await Task.updateOne(
      {
        _id: id
      },{
        status: status
      }
    );
  
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công"
    });
  }catch(error){
    res.json({
      code: 400,
      message: "Not found"
    });
  }
}

//[PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try{
    // const {ids, key, value} = req.body;
    
    const ids: string[] = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;

    enum Key{
      STATUS = "status",
      DELETE = "delete"
    }

    switch (key) {
      case Key.STATUS:
        await Task.updateMany(
          {
            _id: {$in: ids}
          },{
            status: value
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công"
        });
        break;

      case Key.DELETE:
        await Task.updateMany(
          {
            _id: {$in: ids}
          },
          {
            deleted: true,
            deletedAt: new Date()
          }
        );
        res.json({
          code: 200,
          message: "Xóa thành công"
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Error"
        });
        break;
    }
  }catch(error){
    res.json({
      code: 400,
      message: "Error"
    });
  }
}

//[POST] /api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try{
    // req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    
    res.json({
      code: 200,
      message: "Tạo thành công",
      data: data
    });
  }catch(error){
    res.json({
      code: 400,
      message: "Error"
    });
  }
}

// [PATCH] /api/v1/tasks/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await Task.updateOne({ _id: id }, req.body);

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Error"
    });
  }
}

// [DELETE] /api/v1/tasks/delete/:id
export const deleteTask = async (req: Request, res: Response) => {  
  try {
    const id: string = req.params.id;

    await Task.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });

    res.json({
      code: 200,
      message: "Xóa thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Error"
    });
  }
}